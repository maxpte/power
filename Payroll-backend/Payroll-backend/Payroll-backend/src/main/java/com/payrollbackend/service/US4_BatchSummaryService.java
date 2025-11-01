package com.payrollbackend.service;

import com.payrollbackend.dto.US4_BatchGridDTO;
import com.payrollbackend.model.Account;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.model.PayrollBatchPayment;
import com.payrollbackend.repository.PayrollBatchPaymentRepository;
import com.payrollbackend.repository.PayrollBatchRepository;
import com.payrollbackend.repository.US7_AccountRepository;
import com.payrollbackend.service.US3_PayrollCreationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * USER STORY 4: BATCH SUMMARY & SEARCH
 * Service for viewing all batches, searching, and getting batch details
 */
@Service
public class US4_BatchSummaryService {

    private final PayrollBatchRepository batchRepo;
    private final US3_PayrollCreationService us3Service;
    private final US7_AccountRepository accountRepository;
    private final PayrollBatchPaymentRepository paymentRepo;

    @Autowired
    public US4_BatchSummaryService(PayrollBatchRepository batchRepo, US3_PayrollCreationService us3Service, US7_AccountRepository accountRepository, PayrollBatchPaymentRepository paymentRepo) {
        this.batchRepo = batchRepo;
        this.us3Service = us3Service;
        this.accountRepository = accountRepository;
        this.paymentRepo = paymentRepo;
    }

    // Get all batches
    public List<PayrollBatch> getAllBatches() {
        return batchRepo.findAll();
    }

    // Find by batch reference (unique)
    public Optional<PayrollBatch> getBatchByReference(String reference) {
        return batchRepo.findAll().stream()
                .filter(batch -> batch.getBatchReference().equals(reference))
                .findFirst();
    }

    // Get all payments by batch
    public List<PayrollBatchPayment> getPaymentsByBatch(PayrollBatch batch) {
        return batch.getPayments();
    }

    // Get batch grid list for display
    public List<US4_BatchGridDTO> getBatchGridList() {
        return batchRepo.findAll().stream()
                .map(batch -> {
                    US4_BatchGridDTO dto = new US4_BatchGridDTO(
                            batch.getBatchReference(),
                            batch.getCreatedBy(),
                            batch.getCreatedAt(),
                            batch.getPayments() != null ? batch.getPayments().size() : 0,
                            batch.getMaxDebitAmount(),
                            batch.getTotalDebitAmount(),
                            batch.getStatus(),
                            batch.getCurrency(),
                            batch.getDebitAccount() != null ? batch.getDebitAccount().getNumber() : null
                    );
                    if (batch.getDebitAccount() != null) {
                        if (batch.getDebitAccount().getId() != null) {
                            accountRepository.findById(batch.getDebitAccount().getId()).ifPresent(existing -> dto.setDebitAccountNumber(existing.getNumber()));
                        }
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private boolean isEditableStatus(String status) {
        return status != null && ("PENDING".equalsIgnoreCase(status) || "NOT_APPROVED".equalsIgnoreCase(status));
    }

    @Transactional
    public Optional<PayrollBatch> updateBatch(String batchRefNo, PayrollBatch payload) {
        PayrollBatch existing = batchRepo.findByBatchReference(batchRefNo);
        if (existing == null) return Optional.empty();
        if (!isEditableStatus(existing.getStatus())) return Optional.empty();

        if (payload.getCreatedBy() != null) existing.setCreatedBy(payload.getCreatedBy());
        if (payload.getMaxDebitAmount() != null) existing.setMaxDebitAmount(payload.getMaxDebitAmount());
        if (payload.getTotalDebitAmount() != null) existing.setTotalDebitAmount(payload.getTotalDebitAmount());
        if (payload.getStatus() != null) existing.setStatus(payload.getStatus());
        if (payload.getCurrency() != null) existing.setCurrency(payload.getCurrency());
        if (payload.getDebitAccount() != null && payload.getDebitAccount().getId() != null) {
            accountRepository.findById(payload.getDebitAccount().getId()).ifPresent(existing::setDebitAccount);
        }
        return Optional.of(batchRepo.save(existing));
    }

    @Transactional
    public boolean deleteBatch(String batchRefNo) {
        PayrollBatch existing = batchRepo.findByBatchReference(batchRefNo);
        if (existing == null) return false;
        if (!isEditableStatus(existing.getStatus())) return false;
        batchRepo.delete(existing);
        return true;
    }

    @Transactional
    public Optional<PayrollBatchPayment> updatePayment(String batchRefNo, Long paymentId, PayrollBatchPayment payload) {
        PayrollBatch batch = batchRepo.findByBatchReference(batchRefNo);
        if (batch == null || !isEditableStatus(batch.getStatus())) return Optional.empty();
        return paymentRepo.findById(paymentId).map(existing -> {
            if (!batchRefNo.equals(existing.getBatch().getBatchReference())) return null;
            if (payload.getEmployeeId() != null) existing.setEmployeeId(payload.getEmployeeId());
            if (payload.getEmployeeName() != null) existing.setEmployeeName(payload.getEmployeeName());
            if (payload.getEmployeeAccountNo() != null) existing.setEmployeeAccountNo(payload.getEmployeeAccountNo());
            if (payload.getSalaryAmount() != null) existing.setSalaryAmount(payload.getSalaryAmount());
            if (payload.getCurrency() != null) existing.setCurrency(payload.getCurrency());
            PayrollBatchPayment saved = paymentRepo.save(existing);
            us3Service.recomputeBatchAggregates(saved.getBatch());
            return saved;
        });
    }

    @Transactional
    public boolean deletePayment(String batchRefNo, Long paymentId) {
        PayrollBatch batch = batchRepo.findByBatchReference(batchRefNo);
        if (batch == null || !isEditableStatus(batch.getStatus())) return false;
        Optional<PayrollBatchPayment> p = paymentRepo.findById(paymentId);
        if (p.isEmpty()) return false;
        if (!batchRefNo.equals(p.get().getBatch().getBatchReference())) return false;
        paymentRepo.delete(p.get());
        us3Service.recomputeBatchAggregates(batch);
        return true;
    }
}
