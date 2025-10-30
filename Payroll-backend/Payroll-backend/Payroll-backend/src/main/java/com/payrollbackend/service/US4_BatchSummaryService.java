package com.payrollbackend.service;

import com.payrollbackend.dto.US4_BatchGridDTO;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.model.PayrollBatchPayment;
import com.payrollbackend.repository.PayrollBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    @Autowired
    public US4_BatchSummaryService(PayrollBatchRepository batchRepo) {
        this.batchRepo = batchRepo;
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
                .map(batch -> new US4_BatchGridDTO(
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
}
