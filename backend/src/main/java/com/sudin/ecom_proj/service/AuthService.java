package com.sudin.ecom_proj.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sudin.ecom_proj.dto.AuthResponse;
import com.sudin.ecom_proj.dto.LoginRequest;
import com.sudin.ecom_proj.dto.RegisterRequest;
import com.sudin.ecom_proj.model.Role;
import com.sudin.ecom_proj.model.User;
import com.sudin.ecom_proj.repository.UserRepository;
import com.sudin.ecom_proj.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${admin.secret.code}")
    private String adminSecretCode;

    public AuthResponse register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Username, email and password are required");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Role role = Role.USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            if (request.getAdminCode() == null || !request.getAdminCode().equals(adminSecretCode)) {
                throw new RuntimeException("Invalid admin code");
            }
            role = Role.ADMIN;
        }

        User user = new User(null, request.getUsername(), request.getEmail(),
                passwordEncoder.encode(request.getPassword()), role);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole().name());
    }
}
