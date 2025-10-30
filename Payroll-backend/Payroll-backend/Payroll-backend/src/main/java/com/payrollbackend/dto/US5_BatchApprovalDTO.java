package com.payrollbackend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class US5_BatchApprovalDTO {
    private Long batchId;
    private String batchReference;
    private String createdBy;
    private LocalDateTime createdAt;
    private int numberOfPayments;
    private Double maxDebitAmount;
    private Double totalDebitAmount;
    private String status;
    private String currency;
    private String debitAccount;
    private List<US5_PaymentDetailDTO> payments;

    public US5_BatchApprovalDTO() {}

    public US5_BatchApprovalDTO(Long batchId, String batchReference, String createdBy, LocalDateTime createdAt,
                                int numberOfPayments, Double maxDebitAmount, Double totalDebitAmount,
                                String status, String currency, String debitAccount, List<US5_PaymentDetailDTO> payments) {
        this.batchId = batchId;
        this.batchReference = batchReference;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.numberOfPayments = numberOfPayments;
        this.maxDebitAmount = maxDebitAmount;
        this.totalDebitAmount = totalDebitAmount;
        this.status = status;
        this.currency = currency;
        this.debitAccount = debitAccount;
        this.payments = payments;
    }

    // Getters and setters
    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public String getBatchReference() { return batchReference; }
    public void setBatchReference(String batchReference) { this.batchReference = batchReference; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getNumberOfPayments() { return numberOfPayments; }
    public void setNumberOfPayments(int numberOfPayments) { this.numberOfPayments = numberOfPayments; }

    public Double getMaxDebitAmount() { return maxDebitAmount; }
    public void setMaxDebitAmount(Double maxDebitAmount) { this.maxDebitAmount = maxDebitAmount; }

    public Double getTotalDebitAmount() { return totalDebitAmount; }
    public void setTotalDebitAmount(Double totalDebitAmount) { this.totalDebitAmount = totalDebitAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDebitAccount() { return debitAccount; }
    public void setDebitAccount(String debitAccount) { this.debitAccount = debitAccount; }

    public List<US5_PaymentDetailDTO> getPayments() { return payments; }
    public void setPayments(List<US5_PaymentDetailDTO> payments) { this.payments = payments; }
}
