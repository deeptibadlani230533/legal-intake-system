package com.deepti.legalintake.repository;

import com.deepti.legalintake.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    List<Invoice> findAllByOrderByCreatedAtDesc();

    List<Invoice> findByCaseIdOrderByCreatedAtDesc(Long caseId);

    List<Invoice> findByStatusOrderByCreatedAtDesc(String status);

    // 🔥 NEW — fetch invoices via case → client
    @Query("""
    SELECT i FROM Invoice i
    JOIN Case c ON i.caseId = c.id
    WHERE c.userId = :userId
    ORDER BY i.createdAt DESC
""")
    List<Invoice> findInvoicesByClientId(@Param("userId") Long userId);
}