/*
 * ============================================
 * PAGE: ACCOUNTS (Top Section)
 * PACKAGE: com.payrollbackend.dto
 * PURPOSE: DTO for account summary display
 * ============================================
 */
package com.payrollbackend.dto;

public class US7_AccountSummaryDTO {
    private String account;
    private String currency;
    private String accountName;
    private String balance;
    private String selectedCurrencyBalance;
    private String lastUpdated;

    public US7_AccountSummaryDTO() {}

    public US7_AccountSummaryDTO(String account, String currency, String accountName, String balance, String selectedCurrencyBalance, String lastUpdated) {
        this.account = account;
        this.currency = currency;
        this.accountName = accountName;
        this.balance = balance;
        this.selectedCurrencyBalance = selectedCurrencyBalance;
        this.lastUpdated = lastUpdated;
    }

    // Getters and Setters
    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }

    public String getBalance() { return balance; }
    public void setBalance(String balance) { this.balance = balance; }

    public String getSelectedCurrencyBalance() { return selectedCurrencyBalance; }
    public void setSelectedCurrencyBalance(String selectedCurrencyBalance) { this.selectedCurrencyBalance = selectedCurrencyBalance; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
}
