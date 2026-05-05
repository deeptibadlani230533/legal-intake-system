package com.deepti.legalintake.service;

import com.deepti.legalintake.entity.Invoice;
import com.deepti.legalintake.exception.ApiException;
import com.deepti.legalintake.repository.CaseRepository;
import com.deepti.legalintake.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CaseRepository    caseRepository;

    // ─── CREATE ────────────────────────────────────────────────────────────────

    /**
     * Create a new invoice. Allowed for admin AND lawyer roles.
     * (Frontend BillingPage.jsx shows "New Invoice" button for both roles.)
     */
    @Transactional
    public Invoice createInvoice(Long caseId, Integer amount, Integer paid,
                                 String status, LocalDate issuedOn, LocalDate dueOn,
                                 Double hours) {

        caseRepository.findById(caseId)
                .orElseThrow(() -> ApiException.notFound("Case #" + caseId + " not found"));

        // ✅ FIX: Accept the full payload the frontend sends (paid, status fields)
        //         instead of ignoring them and always defaulting to 0 / "pending".
        Invoice invoice = Invoice.builder()
                .caseId(caseId)
                .amount(amount)
                .paid(paid   != null ? paid   : 0)
                .status(status != null ? status : "pending")
                .issuedOn(issuedOn != null ? issuedOn : LocalDate.now())
                .dueOn(dueOn)
                .hours(hours != null ? hours : 0.0)
                .build();

        return invoiceRepository.save(invoice);
    }

    // ─── READ ──────────────────────────────────────────────────────────────────

    /**
     * All invoices, newest first.
     * ✅ FIX: was findAll() with no ordering — now consistently ordered DESC.
     */
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Invoice> getInvoicesByCase(Long caseId) {
        return invoiceRepository.findByCaseIdOrderByCreatedAtDesc(caseId);
    }

    public List<Invoice> getInvoicesByStatus(String status) {
        return invoiceRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Invoice getInvoiceById(String id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Invoice not found: " + id));
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    @Transactional
    public Invoice updateInvoice(String id, Map<String, Object> updates) {
        Invoice inv = getInvoiceById(id);

        if (updates.containsKey("amount"))  inv.setAmount(((Number) updates.get("amount")).intValue());
        if (updates.containsKey("paid"))    inv.setPaid(((Number) updates.get("paid")).intValue());
        if (updates.containsKey("hours"))   inv.setHours(((Number) updates.get("hours")).doubleValue());
        if (updates.containsKey("dueOn"))   inv.setDueOn(LocalDate.parse((String) updates.get("dueOn")));
        if (updates.containsKey("issuedOn"))inv.setIssuedOn(LocalDate.parse((String) updates.get("issuedOn")));
        if (updates.containsKey("status")) {
            validateStatus((String) updates.get("status"));
            inv.setStatus((String) updates.get("status"));
        }

        // ✅ FIX: Auto-derive status when paid amount changes
        if (updates.containsKey("paid") && !updates.containsKey("status")) {
            int paidAmt   = inv.getPaid();
            int totalAmt  = inv.getAmount();
            if      (paidAmt <= 0)            inv.setStatus("pending");
            else if (paidAmt >= totalAmt)     inv.setStatus("paid");
            else                              inv.setStatus("partial");
        }

        return invoiceRepository.save(inv);
    }

    /**
     * Mark invoice fully paid — shortcut used by "Mark as Paid" button.
     */
    @Transactional
    public Invoice markAsPaid(String id) {
        Invoice inv = getInvoiceById(id);
        inv.setStatus("paid");
        inv.setPaid(inv.getAmount());
        return invoiceRepository.save(inv);
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    @Transactional
    public void deleteInvoice(String id) {
        invoiceRepository.delete(getInvoiceById(id));
    }

    // ─── SUMMARY ───────────────────────────────────────────────────────────────

    /**
     * Billing summary stats for the dashboard cards in BillingPage.jsx.
     */
    public Map<String, Object> getBillingSummary() {
        List<Invoice> all = invoiceRepository.findAll();

        long totalInvoices = all.size();
        long paid          = all.stream().filter(i -> "paid".equals(i.getStatus())).count();
        long pending       = all.stream().filter(i -> "pending".equals(i.getStatus())).count();
        long overdue       = all.stream().filter(i -> "overdue".equals(i.getStatus())).count();
        long partial       = all.stream().filter(i -> "partial".equals(i.getStatus())).count();

        double totalRevenue      = all.stream().mapToInt(Invoice::getAmount).sum();
        double totalCollected    = all.stream().mapToInt(Invoice::getPaid).sum();
        double outstandingAmount = totalRevenue - totalCollected;
        double totalHours        = all.stream().mapToDouble(Invoice::getHours).sum();

        // ✅ FIX: Use LinkedHashMap so JSON field order is stable / predictable
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalInvoices",     totalInvoices);
        summary.put("paid",              paid);
        summary.put("pending",           pending);
        summary.put("overdue",           overdue);
        summary.put("partial",           partial);
        summary.put("totalRevenue",      totalRevenue);
        summary.put("totalCollected",    totalCollected);
        summary.put("outstandingAmount", outstandingAmount);
        summary.put("totalHours",        totalHours);
        return summary;
    }

    // ─── HELPERS ───────────────────────────────────────────────────────────────

    private void validateStatus(String status) {
        List<String> valid = List.of("pending", "partial", "paid", "overdue");
        if (!valid.contains(status)) {
            throw ApiException.badRequest(
                    "Invalid invoice status: '" + status + "'. Must be one of: " + valid);
        }
    }

    // 🔥 NEW — client invoices
    public List<Invoice> getInvoicesForClient(Long userId) {
        return invoiceRepository.findInvoicesByClientId(userId);
    }
}