package com.deepti.legalintake.controller;

import com.deepti.legalintake.dto.request.*;
import com.deepti.legalintake.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AUTH CONTROLLER - replaces authController.js + authRoutes.js combined
 *
 * In Node (Fastify) routes and handlers were separate files.
 * In Spring Boot they're combined: @RestController class = routes + handlers together.
 *
 * @RestController    = handles HTTP requests, returns JSON automatically
 * @RequestMapping    = base URL prefix for all routes in this class → "/api/auth"
 * @RequiredArgsConstructor = Lombok injects AuthService via constructor
 *
 * @Valid on @RequestBody = trigger Spring validation (@NotBlank, @Email etc on DTOs)
 *   If invalid → GlobalExceptionHandler.handleValidationErrors() returns 400 automatically
 *
 * @Tag = Swagger group label (shows in swagger-ui.html)
 * @Operation = Swagger endpoint description
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Signup, Login, OTP, Password Reset")
public class AuthController {

    private final AuthService authService;

    /** POST /api/auth/login - replaces fastify.post("/login", loginSchema, authController.login) */
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Returns JWT token on success")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    /** POST /api/auth/signup */
    @PostMapping("/signup")
    @Operation(summary = "Signup", description = "Create a new user account")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody SignupRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(req));
    }

    /** POST /api/auth/request-otp */
    @PostMapping("/request-otp")
    @Operation(summary = "Request OTP", description = "Send OTP to email for password reset")
    public ResponseEntity<Map<String, String>> requestOtp(@Valid @RequestBody RequestOtpRequest req) {
        return ResponseEntity.ok(authService.requestOTP(req));
    }

    /** POST /api/auth/verify-otp */
    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP")
    public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody VerifyOtpRequest req) {
        return ResponseEntity.ok(authService.verifyOTP(req));
    }

    /** POST /api/auth/reset-password */
    @PostMapping("/reset-password")
    @Operation(summary = "Reset Password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        return ResponseEntity.ok(authService.resetPassword(req));
    }
}