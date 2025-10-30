/*
 * ============================================
 * USER STORY 5: APPROVAL WORKFLOW
 * FRONTEND PAGES: PayrollList, BatchDetails, ApproveHome, ProcessedBatches
 * PURPOSE: Approve/reject batches, view pending and processed batches
 * ============================================
 */
package com.payrollbackend.controller;

import com.payrollbackend.dto.US5_ApprovalBatchListDTO;
import com.payrollbackend.dto.US5_BatchDetailDTO;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.service.US5_ApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/us5/approval")
public class US5_ApprovalController {

    private final US5_ApprovalService approvalService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public US5_ApprovalController(US5_ApprovalService approvalService, AuthenticationManager authenticationManager) {
        this.approvalService = approvalService;
        this.authenticationManager = authenticationManager;
    }

    // GET batches pending approval
    @GetMapping("/pending")
    public List<US5_ApprovalBatchListDTO> getPendingApprovalBatches() {
        return approvalService.getPendingApprovalBatches();
    }

    // GET batch details with transactions
    @GetMapping("/details/{batchReference}")
    public US5_BatchDetailDTO getBatchDetails(@PathVariable String batchReference) {
        return approvalService.getBatchDetailsWithTransactions(batchReference);
    }

    // POST approve selected batches
    @PostMapping("/approve")
    public ResponseEntity<Map<String, String>> approveBatches(@RequestBody Map<String, Object> payload) {
        @SuppressWarnings("unchecked")
        List<String> batchReferences = (List<String>) payload.get("batchReferences");
        String password = (String) payload.get("password");

        if (batchReferences == null || batchReferences.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "batchReferences is required"));
        }
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "password is required"));
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid password"));
        }

        approvalService.approveBatches(batchReferences, username);
        return ResponseEntity.ok(Map.of("message", "Batches approved successfully"));
    }

    // POST reject selected batches
    @PostMapping("/reject")
    public ResponseEntity<Map<String, String>> rejectBatches(@RequestBody Map<String, Object> payload) {
        @SuppressWarnings("unchecked")
        List<String> batchReferences = (List<String>) payload.get("batchReferences");
        String password = (String) payload.get("password");

        if (batchReferences == null || batchReferences.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "batchReferences is required"));
        }
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "password is required"));
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid password"));
        }

        approvalService.rejectBatches(batchReferences);
        return ResponseEntity.ok(Map.of("message", "Batches rejected successfully"));
    }

    // GET processed batches
    @GetMapping("/processed")
    public List<US5_ApprovalBatchListDTO> getProcessedBatches() {
        return approvalService.getProcessedBatches();
    }

    // UPDATE batch status
    @PutMapping("/status/{batchReference}")
    public PayrollBatch updateBatchStatus(@PathVariable String batchReference, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        return approvalService.updateStatusAndAdjustBalance(batchReference, newStatus);
    }
}