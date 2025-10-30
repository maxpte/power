// src/main/java/com/payrollbackend/service/HomeDashboardService.java
package com.payrollbackend.service;

import com.payrollbackend.dto.*;
import com.payrollbackend.model.PayrollBatch;
import com.payrollbackend.repository.PayrollBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class US2_HomeDashboardService {
    @Autowired
    private PayrollBatchRepository batchRepo;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy", Locale.ENGLISH);

    public US2_HomeDashboardDTO getDashboard() {
        List<PayrollBatch> all = batchRepo.findAll();

        int pending = (int) all.stream().filter(b -> "PENDING".equalsIgnoreCase(b.getStatus())).count();
        int rejected = (int) all.stream().filter(b -> "REJECTED".equalsIgnoreCase(b.getStatus())).count();
        int processed = (int) all.stream().filter(b -> "APPROVED".equalsIgnoreCase(b.getStatus())).count();

        List<US2_BatchSummaryDTO> recentBatches = all.stream()
                .sorted(Comparator.comparing(PayrollBatch::getCreatedAt).reversed())
                .limit(5)
                .map(batch -> new US2_BatchSummaryDTO(
                        batch.getBatchReference(), // Batch ID
                        formatAmount(batch.getTotalDebitAmount(), batch.getCurrency()),
                        batch.getStatus(),
                        batch.getCreatedAt().format(DATE_FORMATTER)
                ))
                .collect(Collectors.toList());

        US2_HomeDashboardDTO dto = new US2_HomeDashboardDTO();
        dto.setPendingApprovalCount(pending);
        dto.setRejectedCount(rejected);
        dto.setProcessedCount(processed);
        dto.setRecentBatches(recentBatches);

        return dto;
    }

    private String formatAmount(Double amount, String currency) {
        if (amount == null || currency == null) return "";
        String symbol = "₹";
        if ("USD".equals(currency)) symbol = "$";
        else if ("EUR".equals(currency)) symbol = "€";
        return symbol + String.format("%,.2f", amount);
    }
}
