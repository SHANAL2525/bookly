package com.bookly.dto;

public class SettingsResponse {

    private Long id;
    private String businessHours;
    private Integer bookingBufferMinutes;
    private String cancellationPolicy;
    private Boolean allowOnlinePayments;
    private Long businessId;

    public SettingsResponse(Long id, String businessHours, Integer bookingBufferMinutes, String cancellationPolicy, Boolean allowOnlinePayments, Long businessId) {
        this.id = id;
        this.businessHours = businessHours;
        this.bookingBufferMinutes = bookingBufferMinutes;
        this.cancellationPolicy = cancellationPolicy;
        this.allowOnlinePayments = allowOnlinePayments;
        this.businessId = businessId;
    }

    public Long getId() {
        return id;
    }

    public String getBusinessHours() {
        return businessHours;
    }

    public Integer getBookingBufferMinutes() {
        return bookingBufferMinutes;
    }

    public String getCancellationPolicy() {
        return cancellationPolicy;
    }

    public Boolean getAllowOnlinePayments() {
        return allowOnlinePayments;
    }

    public Long getBusinessId() {
        return businessId;
    }
}
