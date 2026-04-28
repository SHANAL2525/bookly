package com.bookly.dto;

public class StaffResponse {

    private Long id;
    private String name;
    private String role;
    private String email;
    private String phone;
    private String availability;
    private Long businessId;

    public StaffResponse(Long id, String name, String role, String email, String phone, String availability, Long businessId) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.email = email;
        this.phone = phone;
        this.availability = availability;
        this.businessId = businessId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAvailability() {
        return availability;
    }

    public Long getBusinessId() {
        return businessId;
    }
}
