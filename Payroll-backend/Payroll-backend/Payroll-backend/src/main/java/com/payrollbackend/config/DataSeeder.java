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
                inr.setName("INR Account");
                inr.setBank("Standard Chartered INR Operating A/C");
                inr.setNumber("500012345678");
                inr.setCurrency("INR");
                inr.setDescription("Used for salary payouts and regular payroll batches.");
                inr.setBalance(new BigDecimal("10000000.00"));
                inr.setLastUpdated(LocalDateTime.now());

                Account usd = new Account();
                usd.setName("USD Account");
                usd.setBank("Standard Chartered USD Nostro");
                usd.setNumber("8881234567");
                usd.setCurrency("USD");
                usd.setDescription("Used for payroll in US Dollars. SWIFT-enabled.");
                usd.setBalance(new BigDecimal("125000.00"));
                usd.setLastUpdated(LocalDateTime.now());

                Account eur = new Account();
                eur.setName("EUR Account");
                eur.setBank("Standard Chartered EUR Treasury");
                eur.setNumber("300098765432");
                eur.setCurrency("EUR");
                eur.setDescription("For euro-denominated payroll. SEPA supported.");
                eur.setBalance(new BigDecimal("2700000.00"));
                eur.setLastUpdated(LocalDateTime.now());

                US7AccountRepository.save(inr);
                US7AccountRepository.save(usd);
                US7AccountRepository.save(eur);
            }
        };
    }
}
