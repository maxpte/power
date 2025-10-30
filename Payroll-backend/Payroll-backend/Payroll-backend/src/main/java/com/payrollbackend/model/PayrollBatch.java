package com.payrollbackend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "payroll_batch")
public class PayrollBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_reference", unique = true, nullable = false)
    private String batchReference;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(optional = true)
    @JoinColumn(name = "debit_account_id", nullable = true)
    private Account debitAccount;

    @Column(name = "max_debit_amount", nullable = false)
    private Double maxDebitAmount;

    @Column(name = "total_debit_amount", nullable = false)
    private Double totalDebitAmount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "required_approvers", nullable = false)
    private Integer requiredApprovers = 1;

    @Column(name = "approvals_done", nullable = false)
    private Integer approvalsDone = 0;

    @Column(name = "approver_users")
    private String approverUsers = ""; // comma-separated usernames

    @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PayrollBatchPayment> payments;

    public PayrollBatch() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBatchReference() { return batchReference; }
    public void setBatchReference(String batchReference) { this.batchReference = batchReference; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Account getDebitAccount() { return debitAccount; }
    public void setDebitAccount(Account debitAccount) { this.debitAccount = debitAccount; }

    public Double getMaxDebitAmount() { return maxDebitAmount; }
    public void setMaxDebitAmount(Double maxDebitAmount) { this.maxDebitAmount = maxDebitAmount; }

    public Double getTotalDebitAmount() { return totalDebitAmount; }
    public void setTotalDebitAmount(Double totalDebitAmount) { this.totalDebitAmount = totalDebitAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getRequiredApprovers() { return requiredApprovers; }
    public void setRequiredApprovers(Integer requiredApprovers) { this.requiredApprovers = requiredApprovers; }

    public Integer getApprovalsDone() { return approvalsDone; }
    public void setApprovalsDone(Integer approvalsDone) { this.approvalsDone = approvalsDone; }

    public String getApproverUsers() { return approverUsers; }
    public void setApproverUsers(String approverUsers) { this.approverUsers = approverUsers; }

    public List<PayrollBatchPayment> getPayments() { return payments; }
    public void setPayments(List<PayrollBatchPayment> payments) { this.payments = payments; }
}
