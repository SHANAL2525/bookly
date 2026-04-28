package com.bookly.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingResponse {

    private Long id;
    private String customerName;
    private String customerEmail;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String status;
    private String notes;
    private Long serviceId;
    private String serviceName;
    private Long staffId;
    private String staffName;
    private Long businessId;

    public BookingResponse(
            Long id,
            String customerName,
            String customerEmail,
            LocalDate bookingDate,
            LocalTime bookingTime,
            String status,
            String notes,
            Long serviceId,
            String serviceName,
            Long staffId,
            String staffName,
            Long businessId
    ) {
        this.id = id;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.status = status;
        this.notes = notes;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.staffId = staffId;
        this.staffName = staffName;
        this.businessId = businessId;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public LocalTime getBookingTime() {
        return bookingTime;
    }

    public String getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public Long getStaffId() {
        return staffId;
    }

    public String getStaffName() {
        return staffName;
    }

    public Long getBusinessId() {
        return businessId;
    }
}
