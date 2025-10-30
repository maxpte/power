/*
 * ============================================
 * PAGE: TRANSACTION PRINT PREVIEW
 * PACKAGE: com.payrollbackend.dto
 * PURPOSE: DTO for transaction list with print preview
 * ============================================
 */
package com.payrollbackend.dto;

public class US6_TransactionPrintDTO {
    private String transactionId;
    private String beneficiaryName;
    private String currency;
    private Double amount;
    private String status; // "Batch In-Progress", "Completed", etc.

    public US6_TransactionPrintDTO() {}

    public US6_TransactionPrintDTO(String transactionId, String beneficiaryName, String currency, Double amount, String status) {
        this.transactionId = transactionId;
        this.beneficiaryName = beneficiaryName;
        this.currency = currency;
        this.amount = amount;
        this.status = status;
    }

    // Getters and Setters
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getBeneficiaryName() { return beneficiaryName; }
    public void setBeneficiaryName(String beneficiaryName) { this.beneficiaryName = beneficiaryName; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
