package com.bookly.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookly.dto.BookingRequest;
import com.bookly.dto.BookingResponse;
import com.bookly.entity.Booking;
import com.bookly.entity.Business;
import com.bookly.entity.ServiceItem;
import com.bookly.entity.Staff;
import com.bookly.exception.BadRequestException;
import com.bookly.exception.ResourceNotFoundException;
import com.bookly.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CurrentUserService currentUserService;
    private final ServiceItemService serviceItemService;
    private final StaffService staffService;

    public BookingService(
            BookingRepository bookingRepository,
            CurrentUserService currentUserService,
            ServiceItemService serviceItemService,
            StaffService staffService
    ) {
        this.bookingRepository = bookingRepository;
        this.currentUserService = currentUserService;
        this.serviceItemService = serviceItemService;
        this.staffService = staffService;
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        Business business = currentUserService.getCurrentBusiness();
        return bookingRepository.findByBusiness_IdOrderByBookingDateAscBookingTimeAsc(business.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        return toResponse(getOwnedBooking(id));
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Business business = currentUserService.getCurrentBusiness();
        Booking booking = buildBooking(request, business.getId(), null);
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse updateBooking(Long id, BookingRequest request) {
        Business business = currentUserService.getCurrentBusiness();
        Booking existingBooking = getOwnedBooking(id);
        Booking booking = buildBooking(request, business.getId(), id);
        existingBooking.setCustomerName(booking.getCustomerName());
        existingBooking.setCustomerEmail(booking.getCustomerEmail());
        existingBooking.setBookingDate(booking.getBookingDate());
        existingBooking.setBookingTime(booking.getBookingTime());
        existingBooking.setStatus(booking.getStatus());
        existingBooking.setNotes(booking.getNotes());
        existingBooking.setService(booking.getService());
        existingBooking.setStaff(booking.getStaff());
        existingBooking.setBusiness(booking.getBusiness());
        return toResponse(existingBooking);
    }

    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = getOwnedBooking(id);
        bookingRepository.delete(booking);
    }

    @Transactional
    public BookingResponse createPublicBooking(BookingRequest request) {
        if (request.getBusinessId() == null) {
            throw new BadRequestException("Business ID is required for public booking.");
        }

        Booking booking = buildBooking(request, request.getBusinessId(), null);
        return toResponse(bookingRepository.save(booking));
    }

    private Booking buildBooking(BookingRequest request, Long businessId, Long bookingIdToIgnore) {
        ServiceItem serviceItem = serviceItemService.getServiceForBusiness(request.getServiceId(), businessId);
        Staff staff = staffService.getStaffForBusiness(request.getStaffId(), businessId);

        if (!serviceItem.getBusiness().getId().equals(staff.getBusiness().getId())) {
            throw new BadRequestException("Selected service and staff member must belong to the same business.");
        }

        validateDoubleBooking(businessId, staff.getId(), request.getBookingDate().toString(), request.getBookingTime().toString(), bookingIdToIgnore);

        Booking booking = new Booking();
        booking.setCustomerName(request.getCustomerName().trim());
        booking.setCustomerEmail(request.getCustomerEmail().trim().toLowerCase());
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setStatus(normalizeStatus(request.getStatus()));
        booking.setNotes(request.getNotes());
        booking.setService(serviceItem);
        booking.setStaff(staff);
        booking.setBusiness(serviceItem.getBusiness());
        return booking;
    }

    private void validateDoubleBooking(Long businessId, Long staffId, String bookingDate, String bookingTime, Long bookingIdToIgnore) {
        boolean conflict = bookingIdToIgnore == null
                ? bookingRepository.existsByBusiness_IdAndStaff_IdAndBookingDateAndBookingTime(
                        businessId,
                        staffId,
                        java.time.LocalDate.parse(bookingDate),
                        java.time.LocalTime.parse(bookingTime)
                )
                : bookingRepository.existsByBusiness_IdAndStaff_IdAndBookingDateAndBookingTimeAndIdNot(
                        businessId,
                        staffId,
                        java.time.LocalDate.parse(bookingDate),
                        java.time.LocalTime.parse(bookingTime),
                        bookingIdToIgnore
                );

        if (conflict) {
            throw new BadRequestException("This staff member already has a booking for the selected time slot.");
        }
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return "PENDING";
        }

        String normalized = status.trim().toUpperCase(Locale.ROOT);
        if (!normalized.equals("PENDING") && !normalized.equals("CONFIRMED") && !normalized.equals("CANCELLED")) {
            throw new BadRequestException("Status must be PENDING, CONFIRMED, or CANCELLED.");
        }
        return normalized;
    }

    @Transactional(readOnly = true)
    private Booking getOwnedBooking(Long id) {
        Business business = currentUserService.getCurrentBusiness();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));
        if (!booking.getBusiness().getId().equals(business.getId())) {
            throw new ResourceNotFoundException("Booking not found.");
        }
        return booking;
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getCustomerName(),
                booking.getCustomerEmail(),
                booking.getBookingDate(),
                booking.getBookingTime(),
                booking.getStatus(),
                booking.getNotes(),
                booking.getService().getId(),
                booking.getService().getName(),
                booking.getStaff().getId(),
                booking.getStaff().getName(),
                booking.getBusiness().getId()
        );
    }
}
