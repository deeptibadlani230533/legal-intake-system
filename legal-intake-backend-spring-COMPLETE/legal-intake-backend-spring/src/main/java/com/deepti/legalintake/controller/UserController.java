package com.deepti.legalintake.controller;

import com.deepti.legalintake.entity.User;
import com.deepti.legalintake.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** replaces controllers/userController.js + routes/userRoutes.js */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {

    private final UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/lawyers")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<User>> getLawyers() {
        return ResponseEntity.ok(userService.getLawyers());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }
}