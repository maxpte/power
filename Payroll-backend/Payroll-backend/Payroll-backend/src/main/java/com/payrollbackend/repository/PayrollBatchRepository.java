package com.payrollbackend.repository;

import com.payrollbackend.model.PayrollBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime; // <-- Import this
import java.util.List;          // <-- Import this

public interface PayrollBatchRepository extends JpaRepository<PayrollBatch, Long> {

    PayrollBatch findByBatchReference(String batchReference);

    List<PayrollBatch> findByDebitAccount_IdAndStatusOrderByCreatedAtAsc(Long accountId, String approved);

    // --- FIX 1: This was "Arrays", changed to "List<PayrollBatch>" ---
    List<PayrollBatch> findByDebitAccount_IdAndCurrencyAndStatus(Long accountId, String currency, String approved);

    // --- FIX 2: Added the new method for date filtering ---
    @Query("SELECT b FROM PayrollBatch b WHERE " +
            "b.debitAccount.id = :accountId AND " +
            "b.status = :status AND " +
            "(CAST(:startDate as timestamp) IS NULL OR b.createdAt >= :startDate) AND " + // <-- Fixed
            "(CAST(:endDate as timestamp) IS NULL OR b.createdAt <= :endDate) " +      // <-- Fixed
            "ORDER BY b.createdAt ASC")
    List<PayrollBatch> findBatchesByAccountAndStatusAndDateRange(
            @Param("accountId") Long accountId,
            @Param("status") String status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}