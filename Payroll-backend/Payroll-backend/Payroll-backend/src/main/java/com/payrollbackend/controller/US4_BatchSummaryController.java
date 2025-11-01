/*
 * ============================================
 * USER STORY 4: BATCH SUMMARY & SEARCH
 * FRONTEND PAGES: Payroll, BatchSummary, SearchBar
 * PURPOSE: View all batches, search, and get batch details
 * ============================================
 */
package com.payrollbackend.controller;

import com.payrollbackend.dto.US4_BatchGridDTO;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.model.PayrollBatchPayment;
import com.payrollbackend.service.US4_BatchSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/us4/batch")
public class US4_BatchSummaryController {

    private final US4_BatchSummaryService batchService;

    @Autowired
    public US4_BatchSummaryController(US4_BatchSummaryService batchService) {
        this.batchService = batchService;
    }

    // GET all batches
    @GetMapping
    public List<PayrollBatch> getAllBatches() {
        return batchService.getAllBatches();
    }

    // GET batch grid for table display
    @GetMapping("/grid")
    public List<US4_BatchGridDTO> getBatchGrid() {
        return batchService.getBatchGridList();
    }

    // GET batch by batch reference (ID in table)
    @GetMapping("/{reference}")
    public PayrollBatch getBatchByReference(@PathVariable String reference) {
        Optional<PayrollBatch> batchOpt = batchService.getBatchByReference(reference);
        return batchOpt.orElse(null);
    }

    // GET all payments for batch
    @GetMapping("/{reference}/payments")
    public List<PayrollBatchPayment> getPaymentsByBatch(@PathVariable String reference) {
        Optional<PayrollBatch> batchOpt = batchService.getBatchByReference(reference);
        if (batchOpt.isPresent()) {
            return batchOpt.get().getPayments();
        }
        return null;
    }

    // UPDATE a batch by reference (operators; only when status is PENDING/NOT_APPROVED)
    @PutMapping("/{reference}")
    public ResponseEntity<PayrollBatch> updateBatchByReference(@PathVariable String reference, @RequestBody PayrollBatch payload) {
        return batchService.updateBatch(reference, payload)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(409).build());
    }

    // DELETE a batch by reference (operators; only when status is PENDING/NOT_APPROVED)
    @DeleteMapping("/{reference}")
    public ResponseEntity<Void> deleteBatchByReference(@PathVariable String reference) {
        boolean ok = batchService.deleteBatch(reference);
        if (!ok) return ResponseEntity.status(409).build();
        return ResponseEntity.noContent().build();
    }

    // UPDATE a single payment row
    @PutMapping("/{reference}/payment/{paymentId}")
    public ResponseEntity<PayrollBatchPayment> updatePayment(@PathVariable String reference, @PathVariable Long paymentId, @RequestBody PayrollBatchPayment payload) {
        return batchService.updatePayment(reference, paymentId, payload)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(409).build());
    }

    // DELETE a single payment row
    @DeleteMapping("/{reference}/payment/{paymentId}")
    public ResponseEntity<Void> deletePayment(@PathVariable String reference, @PathVariable Long paymentId) {
        boolean ok = batchService.deletePayment(reference, paymentId);
        if (!ok) return ResponseEntity.status(409).build();
        return ResponseEntity.noContent().build();
    }
}