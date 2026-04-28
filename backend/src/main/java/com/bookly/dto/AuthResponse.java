package com.bookly.dto;

public class AuthResponse {

    private String message;
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private Long businessId;

    public AuthResponse(String message, String token, Long userId, String name, String email, String role, Long businessId) {
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.businessId = businessId;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Long getBusinessId() {
        return businessId;
    }
}
