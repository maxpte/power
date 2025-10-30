package com.payrollbackend.service;

import com.payrollbackend.model.Account;
import com.payrollbackend.model.PayrollBatchPayment;
import com.payrollbackend.repository.US7_AccountRepository;
import com.payrollbackend.repository.PayrollBatchPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class US7_AccountService {

    private final US7_AccountRepository US7AccountRepository;
    private final PayrollBatchPaymentRepository paymentRepository;

    @Autowired
    public US7_AccountService(US7_AccountRepository US7AccountRepository, PayrollBatchPaymentRepository paymentRepository) {
        this.US7AccountRepository = US7AccountRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<Account> findAll() {
        return US7AccountRepository.findAll();
    }

    public Optional<Account> findById(Long id) {
        return US7AccountRepository.findById(id);
    }

    public Account create(Account account) {
        if (account.getLastUpdated() == null) {
            account.setLastUpdated(LocalDateTime.now());
        }
        return US7AccountRepository.save(account);
    }

    public Optional<Account> update(Long id, Account updated) {
        return US7AccountRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setBank(updated.getBank());
            existing.setNumber(updated.getNumber());
            existing.setCurrency(updated.getCurrency());
            existing.setDescription(updated.getDescription());
            existing.setBalance(updated.getBalance());
            existing.setLastUpdated(LocalDateTime.now());
            return US7AccountRepository.save(existing);
        });
    }

    public void delete(Long id) {
        US7AccountRepository.deleteById(id);
    }

    public List<PayrollBatchPayment> getTransactionsForAccount(Long accountId) {
        return paymentRepository.findByBatch_DebitAccount_Id(accountId);
    }
}
