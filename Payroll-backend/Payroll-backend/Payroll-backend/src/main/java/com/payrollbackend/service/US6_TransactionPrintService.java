package com.payrollbackend.service;

import com.payrollbackend.dto.US6_BatchGridDTO;
import com.payrollbackend.dto.US6_BatchDetailDTO;
import com.payrollbackend.dto.US6_TransactionDetailDTO;
import com.payrollbackend.dto.US6_TransactionPrintDTO;
import com.payrollbackend.dto.US6_TransactionPrintDetailDTO;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.model.PayrollBatchPayment;
import com.payrollbackend.repository.PayrollBatchRepository;
import com.payrollbackend.repository.PayrollBatchPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * USER STORY 6: TRANSACTION PRINT PREVIEW
 * Service for transaction print preview and PDF generation
 */
@Service
public class US6_TransactionPrintService {

    private final PayrollBatchRepository batchRepo;
    private final PayrollBatchPaymentRepository paymentRepo;

    @Autowired
    public US6_TransactionPrintService(PayrollBatchRepository batchRepo, PayrollBatchPaymentRepository paymentRepo) {
        this.batchRepo = batchRepo;
        this.paymentRepo = paymentRepo;
    }

    // Get batch grid list for print preview
    public List<US6_BatchGridDTO> getBatchGridList() {
        return batchRepo.findAll().stream()
                .map(batch -> new US6_BatchGridDTO(
                        batch.getBatchReference(),
                        batch.getCreatedBy(),
                        batch.getCreatedAt(),
                        batch.getPayments() != null ? batch.getPayments().size() : 0,
                        batch.getMaxDebitAmount(),
                        batch.getTotalDebitAmount(),
                        batch.getStatus(),
                        batch.getCurrency(),
                        batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null)
                )
                .collect(Collectors.toList());
    }

    // Get batch details with transactions for print
    public US6_BatchDetailDTO getBatchDetailsWithTransactions(String batchReference) {
        PayrollBatch batch = batchRepo.findByBatchReference(batchReference);
        if (batch == null) return null;

        List<US6_TransactionDetailDTO> transactions = batch.getPayments().stream()
                .map(payment -> new US6_TransactionDetailDTO(
                        payment.getId(),
                        payment.getEmployeeName(),
                        payment.getEmployeeAccountNo(),
                        payment.getCurrency(),
                        payment.getSalaryAmount()
                ))
                .collect(Collectors.toList());

        return new US6_BatchDetailDTO(
                batch.getBatchReference(),
                batch.getBatchReference(),
                batch.getCreatedBy(),
                batch.getCreatedAt(),
                batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null,
                batch.getTotalDebitAmount(),
                batch.getCurrency(),
                transactions
        );
    }

    // Get all transactions for print preview
    public List<US6_TransactionPrintDTO> getAllTransactionsForPrint() {
        List<US6_TransactionPrintDTO> transactions = new ArrayList<>();

        List<PayrollBatch> batches = batchRepo.findAll();
        for (PayrollBatch batch : batches) {
            for (PayrollBatchPayment payment : batch.getPayments()) {
                String transactionId = "TXN-" + payment.getId();
                transactions.add(new US6_TransactionPrintDTO(
                        transactionId,
                        payment.getEmployeeName(),
                        payment.getCurrency(),
                        payment.getSalaryAmount(),
                        batch.getStatus()
                ));
            }
        }

        return transactions;
    }

    // Get transaction detail for print preview by transaction ID
    public US6_TransactionPrintDetailDTO getTransactionDetailForPrint(String transactionId) {
        Long paymentId = Long.parseLong(transactionId.replace("TXN-", ""));

        PayrollBatchPayment payment = paymentRepo.findById(paymentId).orElse(null);
        if (payment == null) return null;

        PayrollBatch batch = payment.getBatch();

        return new US6_TransactionPrintDetailDTO(
                batch.getStatus(),
                batch.getBatchReference(),
                batch.getCreatedBy(),
                payment.getSalaryAmount().toString(),
                payment.getCurrency(),
                getPaymentTypeForCurrency(payment.getCurrency()),
                batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null,
                payment.getEmployeeName(),
                payment.getEmployeeAccountNo(),
                getBankNameForCurrency(payment.getCurrency())
        );
    }

    // Get multiple transaction details for batch print
    public List<US6_TransactionPrintDetailDTO> getMultipleTransactionDetailsForPrint(List<String> transactionIds) {
        return transactionIds.stream()
                .map(this::getTransactionDetailForPrint)
                .filter(detail -> detail != null)
                .collect(Collectors.toList());
    }

    // Helper: Get payment type based on currency
    private String getPaymentTypeForCurrency(String currency) {
        if ("INR".equalsIgnoreCase(currency)) return "NEFT";
        if ("USD".equalsIgnoreCase(currency)) return "SWIFT";
        if ("EUR".equalsIgnoreCase(currency)) return "SEPA";
        return "ACH - AUTOMATED";
    }

    // Helper: Get bank name based on currency
    private String getBankNameForCurrency(String currency) {
        if ("INR".equalsIgnoreCase(currency)) return "Standard Chartered Bank";
        if ("USD".equalsIgnoreCase(currency)) return "Standard Chartered Bank (NY)";
        if ("EUR".equalsIgnoreCase(currency)) return "Standard Chartered Bank (Frankfurt)";
        return "Standard Chartered Bank";
    }
}
