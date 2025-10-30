/*
 * ============================================
 * USER STORY 3: PAYROLL CREATION & UPLOAD
 * FRONTEND PAGES: PayrollFilters, PayrollManual, PayrollPayments, 
 *                 PayrollTable, UploadFile, BatchGrid
 * PURPOSE: Create batches, manage payments, upload files
 * ============================================
 */
package com.payrollbackend.controller;

import com.payrollbackend.dto.US3_PayrollBatchGridDTO;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.model.PayrollBatchPayment;
import com.payrollbackend.repository.PayrollBatchPaymentRepository;
import com.payrollbackend.service.US3_PayrollCreationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.payrollbackend.model.Account;
import com.payrollbackend.repository.US7_AccountRepository;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/us3/batch")
public class US3_PayrollCreationController {

    private final US3_PayrollCreationService batchService;
    private final US7_AccountRepository US7AccountRepository;
    private final PayrollBatchPaymentRepository paymentRepo;

    @Autowired
    public US3_PayrollCreationController(US3_PayrollCreationService batchService, US7_AccountRepository US7AccountRepository, PayrollBatchPaymentRepository paymentRepo) {
        this.batchService = batchService;
        this.US7AccountRepository = US7AccountRepository;
        this.paymentRepo = paymentRepo;
    }

    // CREATE a batch (with all payments)
    @PostMapping
    public ResponseEntity<PayrollBatch> createBatch(@RequestBody PayrollBatch batch, @RequestParam(name = "debitAccountId", required = false) Long debitAccountId) {
        if (debitAccountId == null && (batch.getDebitAccount() == null || batch.getDebitAccount().getId() == null)) {
            return ResponseEntity.badRequest().build();
        }
        if (debitAccountId != null) {
            Account account = US7AccountRepository.findById(debitAccountId).orElse(null);
            if (account == null) {
                return ResponseEntity.badRequest().build();
            }
            batch.setDebitAccount(account);
        }
        PayrollBatch saved = batchService.saveBatch(batch);
        return ResponseEntity.ok(saved);
    }

    // Removed - Moved to US4_BatchSummaryController

    // UPDATE a single payment row (amount, name, account, currency, status)
    @PutMapping("/payment/{paymentId}")
    public ResponseEntity<PayrollBatchPayment> updatePayment(@PathVariable Long paymentId, @RequestBody PayrollBatchPayment payload) {
        return paymentRepo.findById(paymentId)
                .map(existing -> {
                    if (payload.getEmployeeId() != null) existing.setEmployeeId(payload.getEmployeeId());
                    if (payload.getEmployeeName() != null) existing.setEmployeeName(payload.getEmployeeName());
                    if (payload.getEmployeeAccountNo() != null) existing.setEmployeeAccountNo(payload.getEmployeeAccountNo());
                    if (payload.getSalaryAmount() != null) existing.setSalaryAmount(payload.getSalaryAmount());
                    if (payload.getCurrency() != null) existing.setCurrency(payload.getCurrency());
                    PayrollBatchPayment saved = paymentRepo.save(existing);
                    // Recompute aggregates for the parent batch so totals are up to date everywhere
                    batchService.recomputeBatchAggregates(saved.getBatch());
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE a single payment row
    @DeleteMapping("/payment/{paymentId}")
    public ResponseEntity<?> deletePayment(@PathVariable Long paymentId) {
        return paymentRepo.findById(paymentId)
                .map(p -> {
                    var batch = p.getBatch();
                    paymentRepo.delete(p);
                    // Recompute aggregates after deletion
                    batchService.recomputeBatchAggregates(batch);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // GET batch grid for display
    @GetMapping("/grid")
    public List<US3_PayrollBatchGridDTO> gridEndpoint() {
        return batchService.getBatchGridList();
    }

    // DELETE a batch by reference number
    @DeleteMapping("/{batchRefNo}")
    public ResponseEntity<Void> deleteBatchByRef(@PathVariable String batchRefNo) {
        boolean deleted = batchService.deleteBatch(batchRefNo);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // UPDATE a batch by reference number
    @PutMapping("/{batchRefNo}")
    public ResponseEntity<PayrollBatch> updateBatchByRef(@PathVariable String batchRefNo, @RequestBody PayrollBatch payload) {
        return batchService.updateBatch(batchRefNo, payload)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // Approval and print endpoints moved to US5 and US6 controllers
}
