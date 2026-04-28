package com.bookly.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bookly.entity.Business;
import com.bookly.entity.User;
import com.bookly.exception.ResourceNotFoundException;
import com.bookly.exception.UnauthorizedException;
import com.bookly.repository.BusinessRepository;
import com.bookly.repository.UserRepository;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;

    public CurrentUserService(UserRepository userRepository, BusinessRepository businessRepository) {
        this.userRepository = userRepository;
        this.businessRepository = businessRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || "anonymousUser".equals(authentication.getName())) {
            throw new UnauthorizedException("Authentication is required.");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user was not found."));
    }

    public Business getCurrentBusiness() {
        User user = getCurrentUser();
        return businessRepository.findByOwnerUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found for the authenticated user."));
    }
}
