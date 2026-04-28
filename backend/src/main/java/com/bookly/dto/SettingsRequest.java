package com.bookly.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SettingsRequest {

    @NotBlank(message = "Business hours are required.")
    private String businessHours;

    @NotNull(message = "Booking buffer is required.")
    @Min(value = 0, message = "Booking buffer cannot be negative.")
    private Integer bookingBufferMinutes;

    @NotBlank(message = "Cancellation policy is required.")
    private String cancellationPolicy;

    @NotNull(message = "Allow online payments flag is required.")
    private Boolean allowOnlinePayments;

    public String getBusinessHours() {
        return businessHours;
    }

    public void setBusinessHours(String businessHours) {
        this.businessHours = businessHours;
    }

    public Integer getBookingBufferMinutes() {
        return bookingBufferMinutes;
    }

    public void setBookingBufferMinutes(Integer bookingBufferMinutes) {
        this.bookingBufferMinutes = bookingBufferMinutes;
    }

    public String getCancellationPolicy() {
        return cancellationPolicy;
    }

    public void setCancellationPolicy(String cancellationPolicy) {
        this.cancellationPolicy = cancellationPolicy;
    }

    public Boolean getAllowOnlinePayments() {
        return allowOnlinePayments;
    }

    public void setAllowOnlinePayments(Boolean allowOnlinePayments) {
        this.allowOnlinePayments = allowOnlinePayments;
    }
}
