package com.deepti.legalintake.service;

import com.deepti.legalintake.dto.request.CalendarEventRequest;
import com.deepti.legalintake.entity.CalendarEvent;
import com.deepti.legalintake.exception.ApiException;
import com.deepti.legalintake.repository.CalendarEventRepository;
import com.deepti.legalintake.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

/** replaces services/calendar.service.js */
@Service
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarEventRepository calendarEventRepository;
    private final CaseRepository caseRepository;

    @Transactional
    public CalendarEvent createEvent(CalendarEventRequest req, Long userId) {
        if (req.getCaseId() != null) {
            caseRepository.findById(req.getCaseId())
                    .orElseThrow(() -> ApiException.notFound("Linked case not found"));
        }

        return calendarEventRepository.save(CalendarEvent.builder()
                .title(req.getTitle())
                .type(req.getType() != null ? req.getType() : "reminder")
                .date(LocalDate.parse(req.getDate()))
                .time(req.getTime())
                .notes(req.getNotes())
                .caseId(req.getCaseId())
                .userId(userId)
                .build());
    }

    public List<CalendarEvent> getEvents(Long userId, String role, int month, int year) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end   = ym.atEndOfMonth();

        return "admin".equals(role)
                ? calendarEventRepository.findByDateBetweenOrderByDateAscTimeAsc(start, end)
                : calendarEventRepository.findByUserIdAndDateBetweenOrderByDateAscTimeAsc(userId, start, end);
    }

    public CalendarEvent getEventById(Long id, Long userId, String role) {
        CalendarEvent e = calendarEventRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Event not found"));

        if (!"admin".equals(role) && !e.getUserId().equals(userId))
            throw ApiException.forbidden("Forbidden");

        return e;
    }

    @Transactional
    public CalendarEvent updateEvent(Long id, CalendarEventRequest req, Long userId, String role) {
        CalendarEvent e = getEventById(id, userId, role);
        if (req.getTitle() != null) e.setTitle(req.getTitle());
        if (req.getDate()  != null) e.setDate(LocalDate.parse(req.getDate()));
        if (req.getTime()  != null) e.setTime(req.getTime());
        if (req.getNotes() != null) e.setNotes(req.getNotes());
        if (req.getType()  != null) e.setType(req.getType());
        return calendarEventRepository.save(e);
    }

    @Transactional
    public void deleteEvent(Long id, Long userId, String role) {
        calendarEventRepository.delete(getEventById(id, userId, role));
    }
}