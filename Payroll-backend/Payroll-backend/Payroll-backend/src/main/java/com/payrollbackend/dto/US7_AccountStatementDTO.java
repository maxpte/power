/*
 * ============================================
 * PAGE: ACCOUNT STATEMENT (Complete Data)
 * PACKAGE: com.payrollbackend.dto
 * PURPOSE: DTO for complete account statement with accounts and transactions
 * ============================================
 */
package com.payrollbackend.dto;

import java.util.List;

public class US7_AccountStatementDTO {
    private Double totalBalance;
    private String selectedCurrency;
    private List<US7_AccountSummaryDTO> accounts;
    private String accountNumber;
    private Double openingBalance;
    private Double closingBalance;
    private List<US7_TransactionHistoryDTO> transactions;

    public US7_AccountStatementDTO() {}

    // Getters and Setters
    public Double getTotalBalance() { return totalBalance; }
    public void setTotalBalance(Double totalBalance) { this.totalBalance = totalBalance; }

    public String getSelectedCurrency() { return selectedCurrency; }
    public void setSelectedCurrency(String selectedCurrency) { this.selectedCurrency = selectedCurrency; }

    public List<US7_AccountSummaryDTO> getAccounts() { return accounts; }
    public void setAccounts(List<US7_AccountSummaryDTO> accounts) { this.accounts = accounts; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public Double getOpeningBalance() { return openingBalance; }
    public void setOpeningBalance(Double openingBalance) { this.openingBalance = openingBalance; }

    public Double getClosingBalance() { return closingBalance; }
    public void setClosingBalance(Double closingBalance) { this.closingBalance = closingBalance; }

    public List<US7_TransactionHistoryDTO> getTransactions() { return transactions; }
    public void setTransactions(List<US7_TransactionHistoryDTO> transactions) { this.transactions = transactions; }
}
