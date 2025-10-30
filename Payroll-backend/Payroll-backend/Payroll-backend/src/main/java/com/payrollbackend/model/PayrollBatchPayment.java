package com.payrollbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "payroll_batch_payment")
public class PayrollBatchPayment {
    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "batch_id", nullable = false)
    @JsonBackReference
    private PayrollBatch batch;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    @Column(name = "salary_amount", nullable = false)
    private Double salaryAmount;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "employee_account_no", nullable = false)
    private String employeeAccountNo;


    public PayrollBatchPayment() {}

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PayrollBatch getBatch() { return batch; }
    public void setBatch(PayrollBatch batch) { this.batch = batch; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public Double getSalaryAmount() { return salaryAmount; }
    public void setSalaryAmount(Double salaryAmount) { this.salaryAmount = salaryAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getEmployeeAccountNo() { return employeeAccountNo; }
    public void setEmployeeAccountNo(String employeeAccountNo) { this.employeeAccountNo = employeeAccountNo; }

}
