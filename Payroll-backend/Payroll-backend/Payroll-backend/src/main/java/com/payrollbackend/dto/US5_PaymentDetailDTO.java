package com.payrollbackend.dto;

/**
 * USER STORY 5: APPROVAL WORKFLOW
 * Independent DTO for payment details in US5
 */
public class US5_PaymentDetailDTO {
    private String employeeId;
    private String employeeName;
    private String employeeAccountNo;
    private Double salaryAmount;
    private String currency;

    public US5_PaymentDetailDTO() {}

    public US5_PaymentDetailDTO(String employeeId, String employeeName, String employeeAccountNo, Double salaryAmount, String currency) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeAccountNo = employeeAccountNo;
        this.salaryAmount = salaryAmount;
        this.currency = currency;
    }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeAccountNo() { return employeeAccountNo; }
    public void setEmployeeAccountNo(String employeeAccountNo) { this.employeeAccountNo = employeeAccountNo; }

    public Double getSalaryAmount() { return salaryAmount; }
    public void setSalaryAmount(Double salaryAmount) { this.salaryAmount = salaryAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}