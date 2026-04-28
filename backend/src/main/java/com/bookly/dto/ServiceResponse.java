package com.bookly.dto;

public class ServiceResponse {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer durationMinutes;
    private Long businessId;

    public ServiceResponse(Long id, String name, String description, Double price, Integer durationMinutes, Long businessId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.durationMinutes = durationMinutes;
        this.businessId = businessId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public Long getBusinessId() {
        return businessId;
    }
}
