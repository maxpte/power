/*
 * ============================================
 * PAGE: BATCH DETAILS (Summary + Transactions)
 * PACKAGE: com.payrollbackend.dto
 * PURPOSE: DTO for batch details page with summary and transaction list
 * ============================================
 */
package com.payrollbackend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class US5_BatchDetailDTO {
    private String batchReference;
    private String batchName;
    private String createdBy;
    private LocalDateTime createdAt;
    private String debitAccount;
    private Double totalDebitAmount;
    private String currency;
    private List<US5_TransactionDetailDTO> transactions;

    public US5_BatchDetailDTO() {}

    public US5_BatchDetailDTO(String batchReference, String batchName, String createdBy, LocalDateTime createdAt,
                              String debitAccount, Double totalDebitAmount, String currency,
                              List<US5_TransactionDetailDTO> transactions) {
        this.batchReference = batchReference;
        this.batchName = batchName;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.debitAccount = debitAccount;
        this.totalDebitAmount = totalDebitAmount;
        this.currency = currency;
        this.transactions = transactions;
    }

    // Getters and Setters
    public String getBatchReference() { return batchReference; }
    public void setBatchReference(String batchReference) { this.batchReference = batchReference; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDebitAccount() { return debitAccount; }
    public void setDebitAccount(String debitAccount) { this.debitAccount = debitAccount; }

    public Double getTotalDebitAmount() { return totalDebitAmount; }
    public void setTotalDebitAmount(Double totalDebitAmount) { this.totalDebitAmount = totalDebitAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public List<US5_TransactionDetailDTO> getTransactions() { return transactions; }
    public void setTransactions(List<US5_TransactionDetailDTO> transactions) { this.transactions = transactions; }
}
