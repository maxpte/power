package com.payrollbackend.config;

import com.payrollbackend.model.Account;
import com.payrollbackend.repository.US7_AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedAccounts(US7_AccountRepository US7AccountRepository) {
        return args -> {
            if (US7AccountRepository.count() == 0) {
                Account inr = new Account();
                inr.setName("Main INR Account");
                inr.setBank("Indian Bank");
                inr.setNumber("INR-001");
                inr.setCurrency("INR");
                inr.setDescription("Primary INR settlement account");
                inr.setBalance(new BigDecimal("1000000.00"));
                inr.setLastUpdated(LocalDateTime.now());

                Account usd = new Account();
                usd.setName("USD Nostro");
                usd.setBank("Bank of America");
                usd.setNumber("USD-001");
                usd.setCurrency("USD");
                usd.setDescription("USD account for international payrolls");
                usd.setBalance(new BigDecimal("500000.00"));
                usd.setLastUpdated(LocalDateTime.now());

                Account eur = new Account();
                eur.setName("EUR Nostro");
                eur.setBank("Deutsche Bank");
                eur.setNumber("EUR-001");
                eur.setCurrency("EUR");
                eur.setDescription("EUR account for SEPA payments");
                eur.setBalance(new BigDecimal("300000.00"));
                eur.setLastUpdated(LocalDateTime.now());

                US7AccountRepository.save(inr);
                US7AccountRepository.save(usd);
                US7AccountRepository.save(eur);
            }
        };
    }
}
