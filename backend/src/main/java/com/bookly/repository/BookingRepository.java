package com.bookly.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookly.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByBusiness_IdOrderByBookingDateAscBookingTimeAsc(Long businessId);

    boolean existsByBusiness_IdAndStaff_IdAndBookingDateAndBookingTime(
            Long businessId,
            Long staffId,
            LocalDate bookingDate,
            LocalTime bookingTime
    );

    boolean existsByBusiness_IdAndStaff_IdAndBookingDateAndBookingTimeAndIdNot(
            Long businessId,
            Long staffId,
            LocalDate bookingDate,
            LocalTime bookingTime,
            Long id
    );
}
