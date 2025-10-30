package com.payrollbackend.repository;

import com.payrollbackend.model.PayrollBatchPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollBatchPaymentRepository extends JpaRepository<PayrollBatchPayment, Long> {
    List<PayrollBatchPayment> findByBatch_BatchReference(String batchReference);
    List<PayrollBatchPayment> findByBatch_DebitAccount_Id(Long accountId);

}
