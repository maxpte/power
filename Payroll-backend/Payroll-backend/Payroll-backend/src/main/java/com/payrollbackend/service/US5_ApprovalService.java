package com.payrollbackend.service;

import com.payrollbackend.dto.US5_PaymentDetailDTO;
import com.payrollbackend.dto.US5_ApprovalBatchListDTO;
import com.payrollbackend.dto.US5_BatchApprovalDTO;
import com.payrollbackend.dto.US5_BatchDetailDTO;
import com.payrollbackend.dto.US5_TransactionDetailDTO;
import com.payrollbackend.model.Account;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.repository.US7_AccountRepository;
import com.payrollbackend.repository.PayrollBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * USER STORY 5: APPROVAL WORKFLOW
 * Service for approving/rejecting batches and managing approval workflow
 */
@Service
public class US5_ApprovalService {

    private final PayrollBatchRepository batchRepo;
    private final US7_AccountRepository accountRepository;

    @Autowired
    public US5_ApprovalService(PayrollBatchRepository batchRepo, US7_AccountRepository accountRepository) {
        this.batchRepo = batchRepo;
        this.accountRepository = accountRepository;
    }

    // Get batch details with payments for approval/manage page
    public US5_BatchApprovalDTO getBatchDetailsForApproval(String batchReference) {
        PayrollBatch batch = batchRepo.findByBatchReference(batchReference);
        if (batch == null) return null;

        List<US5_PaymentDetailDTO> paymentDetails = batch.getPayments().stream()
                .map(p -> new US5_PaymentDetailDTO(
                        p.getEmployeeId(),
                        p.getEmployeeName(),
                        p.getEmployeeAccountNo(),
                        p.getSalaryAmount(),
                        p.getCurrency()
                ))
                .collect(Collectors.toList());

        return new US5_BatchApprovalDTO(
                batch.getId(),
                batch.getBatchReference(),
                batch.getCreatedBy(),
                batch.getCreatedAt(),
                batch.getPayments() != null ? batch.getPayments().size() : 0,
                batch.getMaxDebitAmount(),
                batch.getTotalDebitAmount(),
                batch.getStatus(),
                batch.getCurrency(),
                batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null,
                paymentDetails
        );
    }

    // Get all batches for approval/manage page (list view)
    public List<US5_BatchApprovalDTO> getAllBatchesForApproval() {
        return batchRepo.findAll().stream()
                .map(batch -> {
                    List<US5_PaymentDetailDTO> paymentDetails = batch.getPayments().stream()
                            .map(p -> new US5_PaymentDetailDTO(
                                    p.getEmployeeId(),
                                    p.getEmployeeName(),
                                    p.getEmployeeAccountNo(),
                                    p.getSalaryAmount(),
                                    p.getCurrency()
                            ))
                            .collect(Collectors.toList());

                    return new US5_BatchApprovalDTO(
                            batch.getId(),
                            batch.getBatchReference(),
                            batch.getCreatedBy(),
                            batch.getCreatedAt(),
                            batch.getPayments() != null ? batch.getPayments().size() : 0,
                            batch.getMaxDebitAmount(),
                            batch.getTotalDebitAmount(),
                            batch.getStatus(),
                            batch.getCurrency(),
                            batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null,
                            paymentDetails
                    );
                })
                .collect(Collectors.toList());
    }

    // Get all batches pending approval
    public List<US5_ApprovalBatchListDTO> getPendingApprovalBatches() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return batchRepo.findAll().stream()
                .filter(batch -> "PENDING".equals(batch.getStatus()) || "Batched for Authorization".equals(batch.getStatus()))
                .map(batch -> {
                    US5_ApprovalBatchListDTO dto = new US5_ApprovalBatchListDTO(
                            batch.getId(),
                            batch.getBatchReference(),
                            batch.getBatchReference(),
                            batch.getCreatedBy(),
                            batch.getCreatedAt(),
                            batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null,
                            batch.getPayments() != null ? batch.getPayments().size() : 0,
                            batch.getCurrency(),
                            batch.getMaxDebitAmount(),
                            batch.getCurrency(),
                            batch.getTotalDebitAmount(),
                            batch.getStatus(),
                            batch.getRequiredApprovers(),
                            batch.getApprovalsDone()
                    );
                    String usersStr = batch.getApproverUsers() != null ? batch.getApproverUsers() : "";
                    boolean already = java.util.Arrays.stream(usersStr.split(","))
                            .map(String::trim)
                            .filter(s -> !s.isBlank())
                            .anyMatch(u -> u.equalsIgnoreCase(username));
                    dto.setAlreadyApproved(already);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Get batch details with transactions
    public US5_BatchDetailDTO getBatchDetailsWithTransactions(String batchReference) {
        PayrollBatch batch = batchRepo.findByBatchReference(batchReference);
        if (batch == null) return null;

        List<US5_TransactionDetailDTO> transactions = batch.getPayments().stream()
                .map(payment -> new US5_TransactionDetailDTO(
                        payment.getId(),
                        payment.getEmployeeName(),
                        payment.getEmployeeAccountNo(),
                        payment.getCurrency(),
                        payment.getSalaryAmount()
                ))
                .collect(Collectors.toList());

        return new US5_BatchDetailDTO(
                batch.getBatchReference(),
                batch.getBatchReference(),
                batch.getCreatedBy(),
                batch.getCreatedAt(),
                batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null,
                batch.getTotalDebitAmount(),
                batch.getCurrency(),
                transactions
        );
    }

    // Approve selected batches
    @Transactional
    public void approveBatches(List<String> batchReferences, String username) {
        for (String ref : batchReferences) {
            PayrollBatch batch = batchRepo.findByBatchReference(ref);
            if (batch != null) {
                if (!"APPROVED".equals(batch.getStatus())) {
                    int done = batch.getApprovalsDone() != null ? batch.getApprovalsDone() : 0;
                    int required = batch.getRequiredApprovers() != null ? batch.getRequiredApprovers() : 1;
                    String usersStr = batch.getApproverUsers() != null ? batch.getApproverUsers() : "";
                    java.util.Set<String> approvers = new java.util.HashSet<>();
                    for (String u : usersStr.split(",")) {
                        if (!u.isBlank()) approvers.add(u.trim());
                    }
                    if (!approvers.contains(username)) {
                        approvers.add(username);
                        done = Math.min(required, done + 1);
                        batch.setApprovalsDone(done);
                        batch.setApproverUsers(String.join(",", approvers));
                        if (done >= required) {
                            applyApprovalEffects(batch);
                            batch.setStatus("APPROVED");
                        }
                        batchRepo.save(batch);
                    }
                }
            }
        }
    }

    // Reject selected batches
    @Transactional
    public void rejectBatches(List<String> batchReferences) {
        for (String ref : batchReferences) {
            PayrollBatch batch = batchRepo.findByBatchReference(ref);
            if (batch != null) {
                if ("APPROVED".equals(batch.getStatus())) {
                    refundApprovalEffects(batch);
                }
                batch.setStatus("REJECTED");
                batchRepo.save(batch);
            }
        }
    }

    // Update status and adjust balance
    @Transactional
    public PayrollBatch updateStatusAndAdjustBalance(String batchReference, String newStatus) {
        PayrollBatch batch = batchRepo.findByBatchReference(batchReference);
        if (batch == null) return null;

        String currentStatus = batch.getStatus();
        if (!"APPROVED".equals(currentStatus) && "APPROVED".equals(newStatus)) {
            applyApprovalEffects(batch);
        }
        if ("APPROVED".equals(currentStatus) && !"APPROVED".equals(newStatus)) {
            refundApprovalEffects(batch);
        }
        batch.setStatus(newStatus);
        return batchRepo.save(batch);
    }

    // Get processed (approved/rejected) batches
    public List<US5_ApprovalBatchListDTO> getProcessedBatches() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return batchRepo.findAll().stream()
                .filter(batch -> "APPROVED".equals(batch.getStatus()) || "REJECTED".equals(batch.getStatus()))
                .map(batch -> {
                    US5_ApprovalBatchListDTO dto = new US5_ApprovalBatchListDTO(
                            batch.getId(),
                            batch.getBatchReference(),
                            batch.getBatchReference(),
                            batch.getCreatedBy(),
                            batch.getCreatedAt(),
                            batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null,
                            batch.getPayments() != null ? batch.getPayments().size() : 0,
                            batch.getCurrency(),
                            batch.getMaxDebitAmount(),
                            batch.getCurrency(),
                            batch.getTotalDebitAmount(),
                            batch.getStatus(),
                            batch.getRequiredApprovers(),
                            batch.getApprovalsDone()
                    );
                    String usersStr = batch.getApproverUsers() != null ? batch.getApproverUsers() : "";
                    boolean already = java.util.Arrays.stream(usersStr.split(","))
                            .map(String::trim)
                            .filter(s -> !s.isBlank())
                            .anyMatch(u -> u.equalsIgnoreCase(username));
                    dto.setAlreadyApproved(already);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Private helper: Apply approval effects (debit account)
    private void applyApprovalEffects(PayrollBatch batch) {
        Account account = batch.getDebitAccount();
        if (account == null) return;
        BigDecimal current = account.getBalance() != null ? account.getBalance() : BigDecimal.ZERO;
        BigDecimal debit = BigDecimal.valueOf(batch.getTotalDebitAmount() != null ? batch.getTotalDebitAmount() : 0.0);
        account.setBalance(current.subtract(debit));
        account.setLastUpdated(LocalDateTime.now());
        accountRepository.save(account);
    }

    // Private helper: Refund approval effects (credit account)
    private void refundApprovalEffects(PayrollBatch batch) {
        Account account = batch.getDebitAccount();
        if (account == null) return;
        BigDecimal current = account.getBalance() != null ? account.getBalance() : BigDecimal.ZERO;
        BigDecimal credit = BigDecimal.valueOf(batch.getTotalDebitAmount() != null ? batch.getTotalDebitAmount() : 0.0);
        account.setBalance(current.add(credit));
        account.setLastUpdated(LocalDateTime.now());
        accountRepository.save(account);
    }
}
