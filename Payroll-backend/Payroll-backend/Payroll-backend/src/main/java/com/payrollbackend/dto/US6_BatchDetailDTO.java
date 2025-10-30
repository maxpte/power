package com.payrollbackend.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * USER STORY 6: TRANSACTION PRINT PREVIEW
 * Independent DTO for batch details in US6
 */
public class US6_BatchDetailDTO {
    private String batchReference;
    private String batchName;
    private String createdBy;
    private LocalDateTime createdAt;
    private String debitAccountNumber;
    private Double totalAmount;
    private String currency;
    private List<US6_TransactionDetailDTO> transactions;

    public US6_BatchDetailDTO() {}

    public US6_BatchDetailDTO(String batchReference, String batchName, String createdBy, LocalDateTime createdAt, String debitAccountNumber, Double totalAmount, String currency, List<US6_TransactionDetailDTO> transactions) {
        this.batchReference = batchReference;
        this.batchName = batchName;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.debitAccountNumber = debitAccountNumber;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.transactions = transactions;
    }

    public String getBatchReference() { return batchReference; }
    public void setBatchReference(String batchReference) { this.batchReference = batchReference; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDebitAccountNumber() { return debitAccountNumber; }
    public void setDebitAccountNumber(String debitAccountNumber) { this.debitAccountNumber = debitAccountNumber; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public List<US6_TransactionDetailDTO> getTransactions() { return transactions; }
    public void setTransactions(List<US6_TransactionDetailDTO> transactions) { this.transactions = transactions; }
}