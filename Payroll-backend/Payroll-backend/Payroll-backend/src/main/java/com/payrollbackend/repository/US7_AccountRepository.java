package com.payrollbackend.repository;

import com.payrollbackend.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface US7_AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByNumber(String number);
}
