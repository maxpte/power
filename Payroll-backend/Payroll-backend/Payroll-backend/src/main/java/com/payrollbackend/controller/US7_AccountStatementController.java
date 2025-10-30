/*
 * ============================================
 * PAGE: ACCOUNTS / STATEMENT
 * PACKAGE: com.payrollbackend.controller
 * PURPOSE: API endpoints for account management and transaction history
 * ============================================
 */
package com.payrollbackend.controller;

import com.payrollbackend.dto.*;
import com.payrollbackend.service.US7_AccountStatementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account-statement")
@CrossOrigin(origins = "http://localhost:3000")
public class US7_AccountStatementController {

    @Autowired
    private US7_AccountStatementService US7AccountStatementService;

    // ✅ GET ALL ACCOUNTS (Top table)
    @GetMapping
    public ResponseEntity<List<US7_AccountSummaryDTO>> getAllAccounts() {
        List<US7_AccountSummaryDTO> accounts = US7AccountStatementService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    // GET transactions by account
    @GetMapping("/{accountNumber}/transactions")
    public List<US7_TransactionHistoryDTO> getTransactions(
            @PathVariable String accountNumber,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        return US7AccountStatementService.getTransactionsByAccount(accountNumber, fromDate, toDate);
    }

    // GET complete account statement
    @GetMapping("/{accountNumber}/statement")
    public US7_AccountStatementDTO getAccountStatement(
            @PathVariable String accountNumber,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        return US7AccountStatementService.getAccountStatement(accountNumber, fromDate, toDate);
    }
}
