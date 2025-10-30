/*
 * ============================================
 * PAGE: BATCH DETAILS (Transaction Rows)
 * PACKAGE: com.payrollbackend.dto
 * PURPOSE: DTO for each transaction/payment in batch details
 * ============================================
 */
package com.payrollbackend.dto;

public class US5_TransactionDetailDTO {
    private Long id;
    private String beneficiaryName;
    private String accountNumber;
    private String currency;
    private Double amount;

    public US5_TransactionDetailDTO() {}

    public US5_TransactionDetailDTO(Long id, String beneficiaryName, String accountNumber, String currency, Double amount) {
        this.id = id;
        this.beneficiaryName = beneficiaryName;
        this.accountNumber = accountNumber;
        this.currency = currency;
        this.amount = amount;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBeneficiaryName() { return beneficiaryName; }
    public void setBeneficiaryName(String beneficiaryName) { this.beneficiaryName = beneficiaryName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
