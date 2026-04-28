package com.bookly.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookly.dto.BusinessResponse;
import com.bookly.dto.BusinessUpdateRequest;
import com.bookly.entity.Business;

@Service
public class BusinessService {

    private final CurrentUserService currentUserService;

    public BusinessService(CurrentUserService currentUserService) {
        this.currentUserService = currentUserService;
    }

    public BusinessResponse getCurrentBusiness() {
        return toResponse(currentUserService.getCurrentBusiness());
    }

    @Transactional
    public BusinessResponse updateCurrentBusiness(BusinessUpdateRequest request) {
        Business business = currentUserService.getCurrentBusiness();
        business.setName(request.getName().trim());
        business.setEmail(request.getEmail());
        business.setPhone(request.getPhone());
        business.setAddress(request.getAddress());
        business.setDescription(request.getDescription());
        return toResponse(business);
    }

    private BusinessResponse toResponse(Business business) {
        return new BusinessResponse(
                business.getId(),
                business.getName(),
                business.getEmail(),
                business.getPhone(),
                business.getAddress(),
                business.getDescription(),
                business.getOwnerUserId()
        );
    }
}
