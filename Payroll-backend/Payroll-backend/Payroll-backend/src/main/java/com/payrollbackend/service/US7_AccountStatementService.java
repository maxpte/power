/*
 * ============================================
 * PAGE: ACCOUNTS / STATEMENT
 * PACKAGE: com.payrollbackend.service
 * PURPOSE: Service for account statement using EXISTING tables only
 * USES: payroll_batch and payroll_batch_payment tables
 * NO NEW TABLE REQUIRED!
 * ============================================
 */
package com.payrollbackend.service;

import com.payrollbackend.dto.*;
import com.payrollbackend.model.*;
import com.payrollbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class US7_AccountStatementService {

    @Autowired
    private PayrollBatchRepository batchRepo;

    @Autowired
    private PayrollBatchPaymentRepository paymentRepo;

    @Autowired
    private US7_AccountRepository US7AccountRepository;

    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    // Get all accounts (extracted from batches)
    public List<US7_AccountSummaryDTO> getAllAccounts() {
        List<PayrollBatch> allBatches = batchRepo.findAll();

        // Group by account number + currency
        Map<String, List<PayrollBatch>> accountBatches = allBatches.stream()
                .filter(b -> b.getDebitAccount() != null)
                .collect(Collectors.groupingBy(b -> (b.getDebitAccount().getNumber()) + "-" + b.getCurrency()));

        List<US7_AccountSummaryDTO> accounts = new ArrayList<>();

        for (Map.Entry<String, List<PayrollBatch>> entry : accountBatches.entrySet()) {
            PayrollBatch firstBatch = entry.getValue().get(0);
            String accountNumber = firstBatch.getDebitAccount() != null ? firstBatch.getDebitAccount().getNumber() : null;
            String currency = firstBatch.getCurrency();

            // Calculate balance
            double balance = calculateAccountBalance(accountNumber, currency);

            accounts.add(new US7_AccountSummaryDTO(
                    accountNumber,
                    currency,
                    getAccountName(currency),
                    String.format("%.2f %s", balance, currency),
                    String.format("%.2f USD", convertToUSD(balance, currency)),
                    new Date().toString()
            ));
        }

        return accounts;
    }

    // Get transactions by account
    public List<US7_TransactionHistoryDTO> getTransactionsByAccount(String accountNumber, String fromDate, String toDate) {
        List<US7_TransactionHistoryDTO> transactions = new ArrayList<>();

        Account account = US7AccountRepository.findByNumber(accountNumber).orElse(null);
        if (account == null) {
            return transactions;
        }

        Long accountId = account.getId();

        // --- START OF FIX ---

        // 1. Parse String dates into LocalDateTime
        // (Assumes input is YYYY-MM-DD from <input type="date">)
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        if (fromDate != null && !fromDate.isEmpty()) {
            startDateTime = LocalDate.parse(fromDate).atStartOfDay(); // e.g., 2025-10-01T00:00:00
        }
        if (toDate != null && !toDate.isEmpty()) {
            endDateTime = LocalDate.parse(toDate).atTime(LocalTime.MAX); // e.g., 2025-10-28T23:59:59
        }

        // 2. Call the NEW repository method with the dates
        List<PayrollBatch> batches = batchRepo
                .findBatchesByAccountAndStatusAndDateRange(accountId, "APPROVED", startDateTime, endDateTime);

        // --- END OF FIX ---

        if (batches.isEmpty()) {
            return transactions;
        }

        // Get currency from first batch
        String currency = batches.get(0).getCurrency();

        // Calculate opening balance before the first transaction
        double openingBalance = calculateOpeningBalanceForStatement(accountId, currency, batches.get(0).getCreatedAt());
        double runningBalance = openingBalance;

        // Clear transactions list to rebuild with correct running balance
        transactions.clear();

        for (PayrollBatch batch : batches) {
            double batchTotal = batch.getTotalDebitAmount();
            runningBalance -= batchTotal; // Subtract debit to get new balance

            String mode = determinePaymentMode(batch.getCurrency());

            transactions.add(new US7_TransactionHistoryDTO(
                    batch.getCreatedAt().format(DATETIME_FORMATTER),
                    "Salary Debit",
                    batch.getBatchReference(),
                    mode,
                    String.format("%.2f", batchTotal),
                    "-",
                    String.format("%.2f", runningBalance)
            ));
        }

        // Insert the opening balance as the first entry
        US7_TransactionHistoryDTO openingBalanceTx = new US7_TransactionHistoryDTO(
                startDateTime != null ? startDateTime.format(DATETIME_FORMATTER) : "Start",
                "Opening Balance",
                "-",
                "-",
                "-",
                "-",
                String.format("%.2f", openingBalance)
        );
        transactions.add(0, openingBalanceTx);

        return transactions;
    }

    // Get complete account statement
    public US7_AccountStatementDTO getAccountStatement(String accountNumber, String fromDate, String toDate) {
        US7_AccountStatementDTO statement = new US7_AccountStatementDTO();

        statement.setAccounts(getAllAccounts());
        statement.setTotalBalance(getTotalBalanceInUSD());
        statement.setAccountNumber(accountNumber);

        // Fetch actual currency from account
        Optional<Account> accountOpt = US7AccountRepository.findByNumber(accountNumber);
        String actualCurrency = accountOpt.isPresent() ? accountOpt.get().getCurrency() : "USD";
        statement.setSelectedCurrency(actualCurrency); // Now uses actual account currency

        List<US7_TransactionHistoryDTO> transactions = getTransactionsByAccount(accountNumber, fromDate, toDate);
        statement.setTransactions(transactions);

        // Calculate balances
        if (transactions.size() > 1) { // opening balance + at least one txn
            statement.setOpeningBalance(Double.parseDouble(transactions.get(0).getBalance()));
            statement.setClosingBalance(Double.parseDouble(transactions.get(transactions.size() - 1).getBalance()));
        } else {
            double currentBalance = calculateAccountBalance(accountNumber, actualCurrency);
            statement.setOpeningBalance(currentBalance);
            statement.setClosingBalance(currentBalance);
        }

        // Optionally, you can also set currency to openingBalance/closingBalance if DTO has such fields

        return statement;
    }


    // Helper: Calculate account balance (initial - total debits)
    private double calculateAccountBalance(String accountNumber, String currency) {
        Account account = US7AccountRepository.findByNumber(accountNumber).orElse(null);
        if (account == null) {
            return 0.0;
        }
        return calculateAccountBalanceById(account.getId(), currency);
    }

    // Helper: Calculate account balance by account id
    private double calculateAccountBalanceById(Long accountId, String currency) {
        double initialBalance = getInitialBalance(String.valueOf(accountId), currency);

        double totalDebited = batchRepo
                .findByDebitAccount_IdAndCurrencyAndStatus(accountId, currency, "APPROVED")
                .stream()
                .mapToDouble(PayrollBatch::getTotalDebitAmount)
                .sum();

        return initialBalance - totalDebited;
    }

    // Helper: Calculate opening balance before the first transaction in the statement range
    private double calculateOpeningBalanceForStatement(Long accountId, String currency, LocalDateTime firstTransactionDate) {
        double initialBalance = getInitialBalance(String.valueOf(accountId), currency);

        double totalDebitedBefore = batchRepo
                .findByDebitAccount_IdAndCurrencyAndStatus(accountId, currency, "APPROVED")
                .stream()
                .filter(b -> b.getCreatedAt().isBefore(firstTransactionDate))
                .mapToDouble(PayrollBatch::getTotalDebitAmount)
                .sum();

        return initialBalance - totalDebitedBefore;
    }

    // Helper: Get initial balance (configure these values)
    private double getInitialBalance(String accountNumber, String currency) {
        // You can configure these in application.properties or database
        switch (currency) {
            case "USD": return 50000.00;
            case "EUR": return 40000.00;
            case "INR": return 5000000.00;
            default: return 0.0;
        }
    }

    // Helper: Get account name based on currency
    private String getAccountName(String currency) {
        switch (currency) {
            case "USD": return "USD Payroll Account";
            case "EUR": return "EUR Payroll Account";
            case "INR": return "Salary Account";
            default: return "Payroll Account";
        }
    }

    // Helper: Determine payment mode based on currency
    private String determinePaymentMode(String currency) {
        switch (currency) {
            case "INR": return "NEFT";
            case "USD": return "SWIFT";
            case "EUR": return "SEPA";
            default: return "WIRE";
        }
    }

    // Helper: Convert to USD
    private double convertToUSD(double amount, String currency) {
        switch (currency) {
            case "INR": return amount / 83.0;
            case "EUR": return amount * 1.08;
            case "USD": return amount;
            default: return amount;
        }
    }

    // Helper: Get total balance in USD
    private double getTotalBalanceInUSD() {
        return getAllAccounts().stream()
                .mapToDouble(acc -> {
                    String balanceStr = acc.getBalance().split(" ")[0];
                    return convertToUSD(Double.parseDouble(balanceStr), acc.getCurrency());
                })
                .sum();
    }
}
