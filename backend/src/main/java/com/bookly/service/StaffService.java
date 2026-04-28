package com.bookly.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookly.dto.StaffRequest;
import com.bookly.dto.StaffResponse;
import com.bookly.entity.Business;
import com.bookly.entity.Staff;
import com.bookly.exception.BadRequestException;
import com.bookly.exception.ResourceNotFoundException;
import com.bookly.repository.StaffRepository;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final CurrentUserService currentUserService;

    public StaffService(StaffRepository staffRepository, CurrentUserService currentUserService) {
        this.staffRepository = staffRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> getAllStaff() {
        Business business = currentUserService.getCurrentBusiness();
        return staffRepository.findByBusiness_Id(business.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public StaffResponse getStaffById(Long id) {
        return toResponse(getOwnedStaff(id));
    }

    @Transactional
    public StaffResponse createStaff(StaffRequest request) {
        Business business = currentUserService.getCurrentBusiness();
        if (staffRepository.existsByBusiness_IdAndEmailIgnoreCase(business.getId(), request.getEmail().trim())) {
            throw new BadRequestException("A staff member with this email already exists.");
        }

        Staff staff = new Staff();
        staff.setName(request.getName().trim());
        staff.setRole(request.getRole().trim());
        staff.setEmail(request.getEmail().trim().toLowerCase());
        staff.setPhone(request.getPhone().trim());
        staff.setAvailability(request.getAvailability().trim());
        staff.setBusiness(business);
        return toResponse(staffRepository.save(staff));
    }

    @Transactional
    public StaffResponse updateStaff(Long id, StaffRequest request) {
        Staff staff = getOwnedStaff(id);
        staff.setName(request.getName().trim());
        staff.setRole(request.getRole().trim());
        staff.setEmail(request.getEmail().trim().toLowerCase());
        staff.setPhone(request.getPhone().trim());
        staff.setAvailability(request.getAvailability().trim());
        return toResponse(staff);
    }

    @Transactional
    public void deleteStaff(Long id) {
        Staff staff = getOwnedStaff(id);
        staffRepository.delete(staff);
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> getPublicStaff(Long businessId) {
        return staffRepository.findByBusiness_Id(businessId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Staff getOwnedStaff(Long id) {
        Business business = currentUserService.getCurrentBusiness();
        return getStaffForBusiness(id, business.getId());
    }

    @Transactional(readOnly = true)
    public Staff getStaffForBusiness(Long staffId, Long businessId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found."));
        if (!staff.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Staff member not found.");
        }
        return staff;
    }

    private StaffResponse toResponse(Staff staff) {
        return new StaffResponse(
                staff.getId(),
                staff.getName(),
                staff.getRole(),
                staff.getEmail(),
                staff.getPhone(),
                staff.getAvailability(),
                staff.getBusiness().getId()
        );
    }
}
