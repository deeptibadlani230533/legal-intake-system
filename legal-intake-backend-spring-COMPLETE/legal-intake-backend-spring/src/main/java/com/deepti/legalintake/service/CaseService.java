package com.deepti.legalintake.service;

import com.deepti.legalintake.dto.request.AssignLawyerRequest;
import com.deepti.legalintake.dto.request.CreateCaseRequest;
import com.deepti.legalintake.dto.request.UpdateStatusRequest;
import com.deepti.legalintake.entity.Case;
import com.deepti.legalintake.exception.ApiException;
import com.deepti.legalintake.service.NotificationService;
import com.deepti.legalintake.service.AuditService;
import com.deepti.legalintake.repository.AuditlogRepository;
import com.deepti.legalintake.repository.CaseRepository;
import com.deepti.legalintake.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * CASE SERVICE - replaces services/case.service.js
 *
 * Key differences from Node version:
 * 1. @Transactional - DB rollback on failure (Node had no transaction management)
 * 2. AuditLog is written via AuditAspect (AOP) automatically - no manual logActivity() calls
 *    (we keep manual calls too as fallback so both approaches are demonstrated for interview)
 * 3. NotificationService.push() sends SSE events to connected clients
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    /* ---- CREATE ---- */
    @Transactional
    public Case createCase(CreateCaseRequest req, Long userId) {
        Case newCase = caseRepository.save(Case.builder()
                .caseTitle(req.getCaseTitle())
                .description(req.getDescription())
                .clientName(req.getClientName())
                .clientEmail(req.getClientEmail())
                .clientPhone(req.getClientPhone())
                .clientAddress(req.getClientAddress())
                .category(req.getCategory())
                .opponentName(req.getOpponentName())
                .claimAmount(req.getClaimAmount())
                .incidentDate(req.getIncidentDate() != null ? LocalDate.parse(req.getIncidentDate()) : null)
                .status("open")
                .userId(userId)
                .build());

        auditService.log(userId, "CASE_CREATED", "CASE", newCase.getId(),
                Map.of("caseTitle", newCase.getCaseTitle(), "clientName", newCase.getClientName()));

        // SSE: push notification to all admin users that a new case arrived
        notificationService.pushToRole("admin",
                Map.of("type", "NEW_CASE", "message", "New case submitted: " + newCase.getCaseTitle(),
                        "caseId", newCase.getId()));

        return newCase;
    }

    /* ---- GET ALL (role-based, same logic as your Node version) ---- */
    public List<Case> getAllCases(Long userId, String role) {
        return switch (role) {
            case "admin"  -> caseRepository.findAll();
            case "lawyer" -> caseRepository.findByAssignedLawyerIdOrderByCreatedAtDesc(userId);
            case "client" -> caseRepository.findByUserIdOrderByCreatedAtDesc(userId);
            default       -> throw ApiException.forbidden("Unauthorized role");
        };
    }

    /* ---- GET BY ID ---- */
    public Case getCaseById(Long id, Long userId, String role) {
        Case c = caseRepository.findByIdWithLawyer(id)
                .orElseThrow(() -> ApiException.notFound("Case not found"));

        if ("client".equals(role) && !c.getUserId().equals(userId)) {
            throw ApiException.forbidden("Forbidden");
        }
        return c;
    }

    /* ---- UPDATE STATUS ---- */
    @Transactional
    public Case updateCaseStatus(Long id, UpdateStatusRequest req, Long userId) {
        Case c = caseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Case not found"));

        String oldStatus = c.getStatus();
        c.setStatus(req.getStatus());
        caseRepository.save(c);

        auditService.log(userId, "CASE_STATUS_UPDATED", "CASE", id,
                Map.of("oldStatus", oldStatus, "newStatus", req.getStatus()));

        // SSE: notify the case owner (client) about status change
        notificationService.pushToUser(c.getUserId(),
                Map.of("type", "CASE_STATUS_UPDATED",
                        "message", "Your case \"" + c.getCaseTitle() + "\" status changed to: " + req.getStatus(),
                        "caseId", id));

        // SSE: also notify assigned lawyer if one exists
        if (c.getAssignedLawyerId() != null) {
            notificationService.pushToUser(c.getAssignedLawyerId(),
                    Map.of("type", "CASE_STATUS_UPDATED",
                            "message", "Case \"" + c.getCaseTitle() + "\" is now: " + req.getStatus(),
                            "caseId", id));
        }

        return c;
    }


    /* ---- UPDATE CASE ---- */
    @Transactional
    public Case updateCase(Long id, CreateCaseRequest req, Long userId) {
        Case c = caseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Case not found"));

        if (req.getCaseTitle()    != null) c.setCaseTitle(req.getCaseTitle());
        if (req.getDescription()  != null) c.setDescription(req.getDescription());
        if (req.getClientName()   != null) c.setClientName(req.getClientName());
        if (req.getClientEmail()  != null) c.setClientEmail(req.getClientEmail());
        if (req.getClientPhone()  != null) c.setClientPhone(req.getClientPhone());
        if (req.getCategory()     != null) c.setCategory(req.getCategory());
        if (req.getClaimAmount()  != null) c.setClaimAmount(req.getClaimAmount());

        caseRepository.save(c);

        auditService.log(userId, "CASE_UPDATED", "CASE", id, Map.of("updatedFields", req));

        return c;
    }

    /* ---- DELETE ---- */
    @Transactional
    public void deleteCase(Long id, Long userId) {
        Case c = caseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Case not found"));

        auditService.log(userId, "CASE_DELETED", "CASE", id,
                Map.of("caseTitle", c.getCaseTitle()));

        caseRepository.delete(c);
    }

    /* ---- ASSIGN LAWYER ---- */
    @Transactional
    public Case assignLawyer(Long caseId, AssignLawyerRequest req, Long adminId) {
        Case c = caseRepository.findById(caseId)
                .orElseThrow(() -> ApiException.notFound("Case not found"));

        if ("closed".equals(c.getStatus()))
            throw ApiException.badRequest("Cannot assign a closed case");

        if (c.getAssignedLawyerId() != null)
            throw ApiException.badRequest("Case is already assigned to a lawyer");

        if (!"open".equals(c.getStatus()))
            throw ApiException.badRequest("Only open cases can be assigned");

        // Verify lawyer exists
        userRepository.findById(req.getLawyerId())
                .orElseThrow(() -> ApiException.notFound("Lawyer not found"));

        c.setAssignedLawyerId(req.getLawyerId());
        c.setStatus("assigned");
        caseRepository.save(c);

        auditService.log(adminId, "CASE_ASSIGNED", "CASE", caseId,
                Map.of("assignedTo", req.getLawyerId()));

        // SSE: push notification to the assigned lawyer
        notificationService.pushToUser(req.getLawyerId(),
                Map.of("type", "CASE_ASSIGNED",
                        "message", "You have been assigned case: " + c.getCaseTitle(),
                        "caseId", caseId));

        return c;
    }

    /* ---- ACCEPT CASE ---- */
    @Transactional
    public Case acceptCase(Long caseId, Long lawyerId) {
        Case c = caseRepository.findById(caseId)
                .orElseThrow(() -> ApiException.notFound("Case not found"));

        if (!c.getAssignedLawyerId().equals(lawyerId))
            throw ApiException.forbidden("You are not assigned to this case");

        if (!"assigned".equals(c.getStatus()))
            throw ApiException.badRequest("Case must be in assigned state to accept");

        c.setStatus("in_progress");
        caseRepository.save(c);

        auditService.log(lawyerId, "CASE_ACCEPTED", "CASE", caseId, Map.of());

        return c;
    }

    /* ---- CLOSE CASE ---- */
    @Transactional
    public Case closeCase(Long caseId, Long lawyerId) {
        Case c = caseRepository.findById(caseId)
                .orElseThrow(() -> ApiException.notFound("Case not found"));

        if (!c.getAssignedLawyerId().equals(lawyerId))
            throw ApiException.forbidden("Not your case");

        if (!"in_progress".equals(c.getStatus()))
            throw ApiException.badRequest("Case must be in progress to close");

        c.setStatus("closed");
        caseRepository.save(c);

        auditService.log(lawyerId, "CASE_CLOSED", "CASE", caseId, Map.of());

        return c;
    }

    /* ---- LAWYER CASES ---- */
    public Map<String, Object> getLawyerCases(Long lawyerId) {
        List<Case> cases = caseRepository.findByAssignedLawyerIdOrderByCreatedAtDesc(lawyerId);
        return Map.of("count", cases.size(), "cases", cases);
    }
}