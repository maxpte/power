/*
 * ============================================
 * PAGE: APPROVE PAYROLL (List View)
 * PACKAGE: com.payrollbackend.dto
 * PURPOSE: DTO for approval list page showing pending batches with selection
 * ============================================
 */
package com.payrollbackend.dto;

import java.time.LocalDateTime;

public class US5_ApprovalBatchListDTO {
    private Long batchId;
    private String batchReference;
    private String batchName;
    private String createdBy;
    private LocalDateTime createdAt;
    private String debitedFromAccount;
    private int numberOfPayments;
    private String maxDebitAmountCurrency;
    private Double maxDebitAmount;
    private String totalDebitAmountCurrency;
    private Double totalDebitAmount;
    private String status; // "Batched for Authorization", "PENDING", etc.

    private Integer requiredApprovers; // e.g., 1,2,3
    private Integer approvalsDone;     // e.g., 0..requiredApprovers
    private Boolean alreadyApproved;   // whether current user has approved this batch

    public US5_ApprovalBatchListDTO() {}

    public US5_ApprovalBatchListDTO(Long batchId, String batchReference, String batchName, String createdBy,
                                    LocalDateTime createdAt, String debitedFromAccount, int numberOfPayments,
                                    String maxDebitAmountCurrency, Double maxDebitAmount,
                                    String totalDebitAmountCurrency, Double totalDebitAmount, String status,
                                    Integer requiredApprovers, Integer approvalsDone) {
        this.batchId = batchId;
        this.batchReference = batchReference;
        this.batchName = batchName;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.debitedFromAccount = debitedFromAccount;
        this.numberOfPayments = numberOfPayments;
        this.maxDebitAmountCurrency = maxDebitAmountCurrency;
        this.maxDebitAmount = maxDebitAmount;
        this.totalDebitAmountCurrency = totalDebitAmountCurrency;
        this.totalDebitAmount = totalDebitAmount;
        this.status = status;
        this.requiredApprovers = requiredApprovers;
        this.approvalsDone = approvalsDone;
    }

    // Getters and Setters
    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public String getBatchReference() { return batchReference; }
    public void setBatchReference(String batchReference) { this.batchReference = batchReference; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDebitedFromAccount() { return debitedFromAccount; }
    public void setDebitedFromAccount(String debitedFromAccount) { this.debitedFromAccount = debitedFromAccount; }

    public int getNumberOfPayments() { return numberOfPayments; }
    public void setNumberOfPayments(int numberOfPayments) { this.numberOfPayments = numberOfPayments; }

    public String getMaxDebitAmountCurrency() { return maxDebitAmountCurrency; }
    public void setMaxDebitAmountCurrency(String maxDebitAmountCurrency) { this.maxDebitAmountCurrency = maxDebitAmountCurrency; }

    public Double getMaxDebitAmount() { return maxDebitAmount; }
    public void setMaxDebitAmount(Double maxDebitAmount) { this.maxDebitAmount = maxDebitAmount; }

    public String getTotalDebitAmountCurrency() { return totalDebitAmountCurrency; }
    public void setTotalDebitAmountCurrency(String totalDebitAmountCurrency) { this.totalDebitAmountCurrency = totalDebitAmountCurrency; }

    public Double getTotalDebitAmount() { return totalDebitAmount; }
    public void setTotalDebitAmount(Double totalDebitAmount) { this.totalDebitAmount = totalDebitAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRequiredApprovers() { return requiredApprovers; }
    public void setRequiredApprovers(Integer requiredApprovers) { this.requiredApprovers = requiredApprovers; }

    public Integer getApprovalsDone() { return approvalsDone; }
    public void setApprovalsDone(Integer approvalsDone) { this.approvalsDone = approvalsDone; }

    public Boolean getAlreadyApproved() { return alreadyApproved; }
    public void setAlreadyApproved(Boolean alreadyApproved) { this.alreadyApproved = alreadyApproved; }
}
