package com.payrollbackend.dto;

import java.time.LocalDateTime;

/**
 * USER STORY 6: TRANSACTION PRINT PREVIEW
 * Independent DTO for batch grid display in US6
 */
public class US6_BatchGridDTO {
    private String batchReference;
    private String createdBy;
    private LocalDateTime createdAt;
    private int numberOfPayments;
    private Double maxDebitAmount;
    private Double totalDebitAmount;
    private String status;
    private String currency;
    private String debitAccountNumber;

    public US6_BatchGridDTO() {}

    public US6_BatchGridDTO(String batchReference, String createdBy, LocalDateTime createdAt, int numberOfPayments, Double maxDebitAmount, Double totalDebitAmount, String status, String currency, String debitAccountNumber) {
        this.batchReference = batchReference;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.numberOfPayments = numberOfPayments;
        this.maxDebitAmount = maxDebitAmount;
        this.totalDebitAmount = totalDebitAmount;
        this.status = status;
        this.currency = currency;
        this.debitAccountNumber = debitAccountNumber;
    }

    public String getBatchReference() { return batchReference; }
    public void setBatchReference(String batchReference) { this.batchReference = batchReference; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Double getMaxDebitAmount() { return maxDebitAmount; }
    public void setMaxDebitAmount(Double maxDebitAmount) { this.maxDebitAmount = maxDebitAmount; }

    public Double getTotalDebitAmount() { return totalDebitAmount; }
    public void setTotalDebitAmount(Double totalDebitAmount) { this.totalDebitAmount = totalDebitAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getNumberOfPayments() { return numberOfPayments; }
    public void setNumberOfPayments(int numberOfPayments) { this.numberOfPayments = numberOfPayments; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDebitAccountNumber() { return debitAccountNumber; }
    public void setDebitAccountNumber(String debitAccountNumber) { this.debitAccountNumber = debitAccountNumber; }
}