package com.payrollbackend.dto;

/**
 * USER STORY 6: TRANSACTION PRINT PREVIEW
 * Independent DTO for transaction details in US6
 */
public class US6_TransactionDetailDTO {
    private Long id;
    private String employeeName;
    private String employeeAccountNo;
    private String currency;
    private Double amount;

    public US6_TransactionDetailDTO() {}

    public US6_TransactionDetailDTO(Long id, String employeeName, String employeeAccountNo, String currency, Double amount) {
        this.id = id;
        this.employeeName = employeeName;
        this.employeeAccountNo = employeeAccountNo;
        this.currency = currency;
        this.amount = amount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeAccountNo() { return employeeAccountNo; }
    public void setEmployeeAccountNo(String employeeAccountNo) { this.employeeAccountNo = employeeAccountNo; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}