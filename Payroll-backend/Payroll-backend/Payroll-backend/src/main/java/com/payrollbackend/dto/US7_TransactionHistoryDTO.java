/*
 * ============================================
 * PAGE: TRANSACTION HISTORY (Bottom Section)
 * PACKAGE: com.payrollbackend.dto
 * PURPOSE: DTO for transaction history display
 * ============================================
 */
package com.payrollbackend.dto;

public class US7_TransactionHistoryDTO {
    private String date;
    private String description;
    private String reference;
    private String mode; // "NEFT", "UPI", "RTGS", etc.
    private String debit;
    private String credit;
    private String balance;

    public US7_TransactionHistoryDTO() {}

    public US7_TransactionHistoryDTO(String date, String description, String reference, String mode, String debit, String credit, String balance) {
        this.date = date;
        this.description = description;
        this.reference = reference;
        this.mode = mode;
        this.debit = debit;
        this.credit = credit;
        this.balance = balance;
    }

    // Getters and Setters
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getDebit() { return debit; }
    public void setDebit(String debit) { this.debit = debit; }

    public String getCredit() { return credit; }
    public void setCredit(String credit) { this.credit = credit; }

    public String getBalance() { return balance; }
    public void setBalance(String balance) { this.balance = balance; }
}
