package com.bookly.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookly.dto.BookingRequest;
import com.bookly.dto.BookingResponse;
import com.bookly.dto.ServiceResponse;
import com.bookly.dto.StaffResponse;
import com.bookly.service.BookingService;
import com.bookly.service.ServiceItemService;
import com.bookly.service.StaffService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/public")
public class PublicBookingController {

    private final ServiceItemService serviceItemService;
    private final StaffService staffService;
    private final BookingService bookingService;

    public PublicBookingController(ServiceItemService serviceItemService, StaffService staffService, BookingService bookingService) {
        this.serviceItemService = serviceItemService;
        this.staffService = staffService;
        this.bookingService = bookingService;
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceResponse>> getPublicServices(@RequestParam Long businessId) {
        return ResponseEntity.ok(serviceItemService.getPublicServices(businessId));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<StaffResponse>> getPublicStaff(@RequestParam Long businessId) {
        return ResponseEntity.ok(staffService.getPublicStaff(businessId));
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createPublicBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createPublicBooking(request));
    }
}
