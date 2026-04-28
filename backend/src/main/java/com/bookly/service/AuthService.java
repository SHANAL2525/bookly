package com.bookly.service;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookly.dto.AuthResponse;
import com.bookly.dto.LoginRequest;
import com.bookly.dto.RegisterRequest;
import com.bookly.entity.Business;
import com.bookly.entity.Settings;
import com.bookly.exception.BadRequestException;
import com.bookly.exception.ResourceNotFoundException;
import com.bookly.repository.BusinessRepository;
import com.bookly.repository.SettingsRepository;
import com.bookly.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final SettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            BusinessRepository businessRepository,
            SettingsRepository settingsRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.businessRepository = businessRepository;
        this.settingsRepository = settingsRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }

        com.bookly.entity.User user = new com.bookly.entity.User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() == null || request.getRole().isBlank() ? "BUSINESS_OWNER" : request.getRole());

        com.bookly.entity.User savedUser = userRepository.save(user);

        Business business = new Business();
        business.setName(request.getBusinessName().trim());
        business.setEmail(savedUser.getEmail());
        business.setOwnerUserId(savedUser.getId());
        Business savedBusiness = businessRepository.save(business);

        Settings settings = new Settings();
        settings.setBusiness(savedBusiness);
        settings.setBusinessHours("09:00 - 17:00");
        settings.setBookingBufferMinutes(10);
        settings.setCancellationPolicy("Bookings can be cancelled up to 24 hours before the appointment.");
        settings.setAllowOnlinePayments(Boolean.FALSE);
        settingsRepository.save(settings);

        User userDetails = new User(savedUser.getEmail(), savedUser.getPassword(), java.util.List.of());
        String token = jwtService.generateToken(userDetails, Map.of(
                "userId", savedUser.getId(),
                "role", savedUser.getRole(),
                "businessId", savedBusiness.getId()
        ));

        return new AuthResponse(
                "Registration successful.",
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedBusiness.getId()
        );
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
            );
        } catch (BadCredentialsException exception) {
            throw new BadRequestException("Invalid email or password.");
        }

        com.bookly.entity.User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Long businessId = businessRepository.findByOwnerUserId(user.getId())
                .map(Business::getId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found for this user."));

        User userDetails = new User(user.getEmail(), user.getPassword(), java.util.List.of());
        String token = jwtService.generateToken(userDetails, Map.of(
                "userId", user.getId(),
                "role", user.getRole(),
                "businessId", businessId
        ));

        return new AuthResponse(
                "Login successful.",
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                businessId
        );
    }
}
