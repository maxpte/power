package com.payrollbackend.dto;

import java.util.List;

public class US2_HomeDashboardDTO {
    private int pendingApprovalCount;
    private int rejectedCount;
    private int processedCount;
    private List<US2_BatchSummaryDTO> recentBatches;

    // Getters and Setters

    public int getPendingApprovalCount() {
        return pendingApprovalCount;
    }
    public void setPendingApprovalCount(int pendingApprovalCount) {
        this.pendingApprovalCount = pendingApprovalCount;
    }
    public int getRejectedCount() {
        return rejectedCount;
    }
    public void setRejectedCount(int rejectedCount) {
        this.rejectedCount = rejectedCount;
    }
    public int getProcessedCount() {
        return processedCount;
    }
    public void setProcessedCount(int processedCount) {
        this.processedCount = processedCount;
    }
    public List<US2_BatchSummaryDTO> getRecentBatches() {
        return recentBatches;
    }
    public void setRecentBatches(List<US2_BatchSummaryDTO> recentBatches) {
        this.recentBatches = recentBatches;
    }
}
