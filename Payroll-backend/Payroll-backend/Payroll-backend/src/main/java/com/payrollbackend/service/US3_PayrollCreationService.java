package com.payrollbackend.service;

import com.payrollbackend.dto.US3_PayrollBatchGridDTO;
import com.payrollbackend.model.Account;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.model.PayrollBatchPayment;
import com.payrollbackend.repository.US7_AccountRepository;
import com.payrollbackend.repository.PayrollBatchRepository;
import com.payrollbackend.repository.PayrollBatchPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * USER STORY 3: PAYROLL CREATION & UPLOAD
 * Service for creating batches, managing payments, and file uploads
 */
@Service
public class US3_PayrollCreationService {

    private final PayrollBatchRepository batchRepo;
    private final PayrollBatchPaymentRepository paymentRepo;
    private final US7_AccountRepository accountRepository;

    @Autowired
    public US3_PayrollCreationService(PayrollBatchRepository batchRepo, 
                                      PayrollBatchPaymentRepository paymentRepo, 
                                      US7_AccountRepository accountRepository) {
        this.batchRepo = batchRepo;
        this.paymentRepo = paymentRepo;
        this.accountRepository = accountRepository;
    }

    // Save a batch (with payments)
    public PayrollBatch saveBatch(PayrollBatch batch) {
        batch.setCreatedAt(LocalDateTime.now());

        // Resolve debitAccount by ID if provided
        if (batch.getDebitAccount() != null && batch.getDebitAccount().getId() != null) {
            Account account = accountRepository.findById(batch.getDebitAccount().getId())
                    .orElseThrow(() -> new RuntimeException("Invalid debit account ID: " + batch.getDebitAccount().getId()));
            batch.setDebitAccount(account);
        } else {
            throw new RuntimeException("Debit account must be provided");
        }

        // Make sure all payments reference this batch
        if (batch.getPayments() != null) {
            for (PayrollBatchPayment payment : batch.getPayments()) {
                payment.setBatch(batch);
            }
        }

        // Compute required approvers based on total amount and currency (INR thresholds)
        String curr = (batch.getCurrency() != null ? batch.getCurrency() : 
                      (batch.getDebitAccount() != null && batch.getDebitAccount().getCurrency() != null ? 
                       batch.getDebitAccount().getCurrency() : "INR")).toUpperCase();
        double total = batch.getTotalDebitAmount() != null ? batch.getTotalDebitAmount() : 0.0;
        double inrPer = switch (curr) {
            case "USD" -> 83.0;
            case "EUR" -> 90.0;
            default -> 1.0;
        };
        double t1 = 1_000_000.0 / inrPer;
        double t2 = 2_500_000.0 / inrPer;
        int req = 1;
        if (total > t1 && total < t2) req = 2; 
        else if (total >= t2) req = 3;
        batch.setRequiredApprovers(req);
        batch.setApprovalsDone(0);
        return batchRepo.save(batch);
    }

    // Delete a batch by reference number
    @Transactional
    public boolean deleteBatch(String batchRefNo) {
        PayrollBatch existing = batchRepo.findByBatchReference(batchRefNo);
        if (existing == null) return false;
        batchRepo.delete(existing);
        return true;
    }

    // Update a batch by reference number
    @Transactional
    public Optional<PayrollBatch> updateBatch(String batchRefNo, PayrollBatch payload) {
        PayrollBatch existing = batchRepo.findByBatchReference(batchRefNo);
        if (existing == null) return Optional.empty();

        if (payload.getCreatedBy() != null) existing.setCreatedBy(payload.getCreatedBy());
        if (payload.getMaxDebitAmount() != null) existing.setMaxDebitAmount(payload.getMaxDebitAmount());
        if (payload.getTotalDebitAmount() != null) existing.setTotalDebitAmount(payload.getTotalDebitAmount());
        if (payload.getStatus() != null) existing.setStatus(payload.getStatus());
        if (payload.getCurrency() != null) existing.setCurrency(payload.getCurrency());

        // Update debit account if provided
        if (payload.getDebitAccount() != null) {
            Account in = payload.getDebitAccount();
            if (in.getId() != null) {
                accountRepository.findById(in.getId()).ifPresent(existing::setDebitAccount);
            }
        }

        return Optional.of(batchRepo.save(existing));
    }

    // Get batch grid list for display
    public List<US3_PayrollBatchGridDTO> getBatchGridList() {
        return batchRepo.findAll().stream()
                .map(batch -> new US3_PayrollBatchGridDTO(
                        batch.getBatchReference(),
                        batch.getCreatedBy(),
                        batch.getCreatedAt(),
                        batch.getPayments() != null ? batch.getPayments().size() : 0,
                        batch.getMaxDebitAmount(),
                        batch.getTotalDebitAmount(),
                        batch.getStatus(),
                        batch.getCurrency(),
                        batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null)
                )
                .collect(Collectors.toList());
    }

    // Recompute and persist aggregate amounts for a batch from its payments
    @Transactional
    public void recomputeBatchAggregates(PayrollBatch batch) {
        if (batch == null) return;
        String reference = batch.getBatchReference();
        List<PayrollBatchPayment> payments = paymentRepo.findByBatch_BatchReference(reference);
        double total = 0.0;
        double max = 0.0;
        for (PayrollBatchPayment p : payments) {
            double amt = p.getSalaryAmount() != null ? p.getSalaryAmount() : 0.0;
            total += amt;
            if (amt > max) max = amt;
        }
        batch.setTotalDebitAmount(total);
        batch.setMaxDebitAmount(max);
        batchRepo.save(batch);
    }
}
