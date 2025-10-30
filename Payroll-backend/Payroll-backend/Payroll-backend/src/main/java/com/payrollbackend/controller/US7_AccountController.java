package com.payrollbackend.controller;

import com.payrollbackend.model.Account;
import com.payrollbackend.model.PayrollBatchPayment;
import com.payrollbackend.service.US7_AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/accounts")
public class US7_AccountController {

    private final US7_AccountService US7AccountService;

    @Autowired
    public US7_AccountController(US7_AccountService US7AccountService) {
        this.US7AccountService = US7AccountService;
    }

    @GetMapping
    public List<Account> list() {
        return US7AccountService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> get(@PathVariable Long id) {
        return US7AccountService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Account> create(@RequestBody Account account) {
        Account created = US7AccountService.create(account);
        return ResponseEntity.created(URI.create("/api/accounts/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> update(@PathVariable Long id, @RequestBody Account account) {
        return US7AccountService.update(id, account)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        US7AccountService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/transactions")
    public List<PayrollBatchPayment> transactions(@PathVariable Long id) {
        return US7AccountService.getTransactionsForAccount(id);
    }
}
