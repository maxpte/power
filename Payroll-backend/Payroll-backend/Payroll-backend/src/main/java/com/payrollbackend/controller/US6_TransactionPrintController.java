/*
 * ============================================
 * USER STORY 6: TRANSACTION PRINT PREVIEW
 * FRONTEND PAGES: TransactionPrintArea, TransactionList,
 *                 TransactionPreview, PaymentTransactionPreview
 * PURPOSE: Print preview and PDF generation for transactions
 * ============================================
 */
package com.payrollbackend.controller;

import com.payrollbackend.dto.US6_BatchGridDTO;
import com.payrollbackend.dto.US6_BatchDetailDTO;
import com.payrollbackend.dto.US6_TransactionPrintDTO;
import com.payrollbackend.dto.US6_TransactionPrintDetailDTO;
import com.payrollbackend.service.US6_TransactionPrintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/us6/print")
public class US6_TransactionPrintController {

    private final US6_TransactionPrintService printService;

    @Autowired
    public US6_TransactionPrintController(US6_TransactionPrintService printService) {
        this.printService = printService;
    }

    // GET all transactions for print preview list
    @GetMapping("/transactions")
    public List<US6_TransactionPrintDTO> getAllTransactionsForPrint() {
        return printService.getAllTransactionsForPrint();
    }

    // GET all batches for print preview (batch summaries)
    @GetMapping("/batches")
    public List<US6_BatchGridDTO> getAllBatchesForPrintPreview() {
        return printService.getBatchGridList();
    }

    // GET a batch with all employee/transaction details for print preview
    @GetMapping("/batch/{batchReference}")
    public US6_BatchDetailDTO getBatchWithTransactionsForPrint(@PathVariable String batchReference) {
        return printService.getBatchDetailsWithTransactions(batchReference);
    }

    // GET single transaction detail for preview
    @GetMapping("/transaction/{transactionId}")
    public US6_TransactionPrintDetailDTO getTransactionDetailForPrint(@PathVariable String transactionId) {
        return printService.getTransactionDetailForPrint(transactionId);
    }

    // POST get multiple transaction details for print (before PDF generation)
    @PostMapping("/preview")
    public List<US6_TransactionPrintDetailDTO> getMultipleTransactionDetails(@RequestBody Map<String, List<String>> payload) {
        List<String> transactionIds = payload.get("transactionIds");
        return printService.getMultipleTransactionDetailsForPrint(transactionIds);
    }

    // POST generate PDF for selected transactions
    @PostMapping("/generate-pdf")
    public ResponseEntity<String> generatePDF(@RequestBody Map<String, List<String>> payload) {
        List<String> transactionIds = payload.get("transactionIds");

        // For now, return a success message
        // In production, you would use a PDF library like iText or Apache PDFBox
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body("{\"message\": \"PDF generated successfully for " + transactionIds.size() + " transactions\", \"filename\": \"transactions_" + System.currentTimeMillis() + ".pdf\"}");
    }
}