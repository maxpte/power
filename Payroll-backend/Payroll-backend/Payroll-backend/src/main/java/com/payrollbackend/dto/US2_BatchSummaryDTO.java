package com.payrollbackend.dto;

public class US2_BatchSummaryDTO {
    private String batchId;

    private String amount;
    private String status;
    private String date;

    public US2_BatchSummaryDTO() {}

    public US2_BatchSummaryDTO(String batchId, String amount, String status, String date) {
        this.batchId = batchId;

        this.amount = amount;
        this.status = status;
        this.date = date;
    }

    // Getters and Setters

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }



    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
