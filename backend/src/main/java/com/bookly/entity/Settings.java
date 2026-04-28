package com.bookly.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "settings")
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String businessHours;

    @Column(nullable = false)
    private Integer bookingBufferMinutes;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String cancellationPolicy;

    @Column(nullable = false)
    private Boolean allowOnlinePayments;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false, unique = true)
    private Business business;

    public Settings() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }
}
