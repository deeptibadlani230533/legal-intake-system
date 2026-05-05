package com.deepti.legalintake.service;

import com.deepti.legalintake.entity.User;
import com.deepti.legalintake.exception.ApiException;
import com.deepti.legalintake.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/** replaces controllers/userController.js logic */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getLawyers() {
        return userRepository.findByRoleOrderByCreatedAtDesc("lawyer");
    }

    public Map<String, String> deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("User not found"));
        userRepository.delete(user);
        return Map.of("message", "User deleted successfully");
    }
}