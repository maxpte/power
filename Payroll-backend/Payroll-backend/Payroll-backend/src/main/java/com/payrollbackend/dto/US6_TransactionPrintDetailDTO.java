/*
 * ============================================
 * PAGE: TRANSACTION PRINT PREVIEW (Detail View)
 * PACKAGE: com.payrollbackend.dto
 * PURPOSE: DTO for transaction detail preview with all payment information
 * ============================================
 */
package com.payrollbackend.dto;

public class US6_TransactionPrintDetailDTO {
    // Header information
    private String status;
    private String reference;
    private String generatedBy;

    // Payment details
    private String paymentAmount;
    private String paymentAmountCurrency;
    private String paymentType;
    private String payFrom;

    // Beneficiary details
    private String payTo;
    private String account;
    private String bank;

    public US6_TransactionPrintDetailDTO() {}

    public US6_TransactionPrintDetailDTO(String status, String reference, String generatedBy,
                                         String paymentAmount, String paymentAmountCurrency,
                                         String paymentType, String payFrom, String payTo,
                                         String account, String bank) {
        this.status = status;
        this.reference = reference;
        this.generatedBy = generatedBy;
        this.paymentAmount = paymentAmount;
        this.paymentAmountCurrency = paymentAmountCurrency;
        this.paymentType = paymentType;
        this.payFrom = payFrom;
        this.payTo = payTo;
        this.account = account;
        this.bank = bank;
    }

    // Getters and Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public String getPaymentAmount() { return paymentAmount; }
    public void setPaymentAmount(String paymentAmount) { this.paymentAmount = paymentAmount; }

    public String getPaymentAmountCurrency() { return paymentAmountCurrency; }
    public void setPaymentAmountCurrency(String paymentAmountCurrency) { this.paymentAmountCurrency = paymentAmountCurrency; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public String getPayFrom() { return payFrom; }
    public void setPayFrom(String payFrom) { this.payFrom = payFrom; }

    public String getPayTo() { return payTo; }
    public void setPayTo(String payTo) { this.payTo = payTo; }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public String getBank() { return bank; }
    public void setBank(String bank) { this.bank = bank; }
}
