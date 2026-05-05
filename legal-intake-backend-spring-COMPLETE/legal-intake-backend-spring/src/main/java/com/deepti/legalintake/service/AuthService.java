package com.deepti.legalintake.service;

import com.deepti.legalintake.dto.request.*;
import com.deepti.legalintake.entity.Otp;
import com.deepti.legalintake.entity.User;
import com.deepti.legalintake.exception.ApiException;
import com.deepti.legalintake.repository.OtpRepository;
import com.deepti.legalintake.repository.UserRepository;
import com.deepti.legalintake.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * AUTH SERVICE - replaces services/auth.service.js
 *
 * @Service = Spring-managed bean. Spring creates one instance and injects it
 * wherever needed. Equivalent of just exporting the module in Node.
 *
 * @Transactional on methods means: if any step throws an exception,
 * the entire DB operation is rolled back. Critical for multi-step operations
 * like requestOTP (delete old → create new).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;   // BCryptPasswordEncoder from SecurityConfig
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;         // auto-configured from application.properties

    /**
     * LOGIN - replaces auth.service.js login()
     * In Node: reply.jwtSign({ id, role }) was called here
     * In Spring: JwtUtil.generateToken() replaces that
     */
    public Map<String, Object> login(LoginRequest req) {
        // replaces: User.findOne({ where: { email } })
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));

        // replaces: bcrypt.compare(password, foundUser.passwordHash)
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email or password");
        }

        // replaces: reply.jwtSign({ id: foundUser.id, role: foundUser.role }, { expiresIn: "1d" })
        String token = jwtUtil.generateToken(user.getId(), user.getRole());

        return Map.of(
                "message", "Login successful",
                "token", token,
                "role", user.getRole(),
                "userId", user.getId(),
                "name", user.getName()
        );
    }

    /**
     * SIGNUP - replaces auth.service.js signup()
     */
    @Transactional
    public Map<String, Object> signup(SignupRequest req) {
        // replaces: User.findOne({ where: { email } })
        if (userRepository.existsByEmail(req.getEmail())) {
            throw ApiException.badRequest("User already exists");
        }

        // replaces: bcrypt.hash(password, 10)
        String passwordHash = passwordEncoder.encode(req.getPassword());

        // replaces: User.create({ name, email, passwordHash, role })
        User newUser = userRepository.save(User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordHash)
                .role(req.getRole())
                .build());

        return Map.of(
                "message", "Signup successful",
                "user", Map.of(
                        "id", newUser.getId(),
                        "name", newUser.getName(),
                        "email", newUser.getEmail(),
                        "role", newUser.getRole()
                )
        );
    }

    /**
     * REQUEST OTP - replaces auth.service.js requestOTP()
     */
    @Transactional
    public Map<String, String> requestOTP(RequestOtpRequest req) {
        userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> ApiException.notFound("User not found"));

        // replaces: OTP.destroy({ where: { email } })
        otpRepository.deleteByEmail(req.getEmail());

        // Generate 6-digit code (same as Math.floor(100000 + Math.random() * 900000))
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);

        // OTP expires in 5 minutes
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        // replaces: OTP.create({ email, code, expiresAt, verified: false })
        otpRepository.save(Otp.builder()
                .email(req.getEmail())
                .code(code)
                .expiresAt(expiresAt)
                .verified(false)
                .build());

        // replaces: sendOTPEmail(email, code) from utils/emailService.js
        sendOtpEmail(req.getEmail(), code);

        return Map.of("message", "OTP sent to your email successfully");
    }

    /**
     * VERIFY OTP - replaces auth.service.js verifyOTP()
     */
    @Transactional
    public Map<String, String> verifyOTP(VerifyOtpRequest req) {
        Otp otpRecord = otpRepository
                .findTopByEmailAndCodeAndVerifiedFalseOrderByCreatedAtDesc(req.getEmail(), req.getOtp())
                .orElseThrow(() -> ApiException.badRequest("Invalid or expired OTP"));

        if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("OTP expired");
        }

        // Mark as verified
        otpRecord.setVerified(true);
        otpRepository.save(otpRecord);

        return Map.of("message", "OTP verified successfully");
    }

    /**
     * RESET PASSWORD - replaces auth.service.js resetPassword()
     */
    @Transactional
    public Map<String, String> resetPassword(ResetPasswordRequest req) {
        Otp otpRecord = otpRepository
                .findTopByEmailAndVerifiedTrueOrderByCreatedAtDesc(req.getEmail())
                .orElseThrow(() -> ApiException.badRequest("OTP not verified"));

        if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("OTP expired");
        }

        // replaces: User.update({ passwordHash }, { where: { email } })
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> ApiException.notFound("User not found"));

        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        // replaces: otpRecord.destroy()
        otpRepository.delete(otpRecord);

        return Map.of("message", "Password reset successful");
    }

    /**
     * SEND OTP EMAIL - replaces utils/emailService.js sendOTPEmail()
     * JavaMailSender is Spring's built-in email client (equivalent of nodemailer)
     */
    private void sendOtpEmail(String toEmail, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your Legal Intake OTP Code");
            message.setText(
                    "Your OTP code is: " + code + "\n\n" +
                            "This code expires in 5 minutes.\n" +
                            "If you did not request this, please ignore this email."
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            // Don't throw - same behavior as your Node code (fire and forget)
        }
    }
}