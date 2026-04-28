package com.bookly.dto;

public class BusinessResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String description;
    private Long ownerUserId;

    public BusinessResponse(Long id, String name, String email, String phone, String address, String description, Long ownerUserId) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.description = description;
        this.ownerUserId = ownerUserId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getDescription() {
        return description;
    }

    public Long getOwnerUserId() {
        return ownerUserId;
    }
}
