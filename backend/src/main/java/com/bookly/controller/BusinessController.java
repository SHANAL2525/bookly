package com.bookly.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookly.dto.BusinessResponse;
import com.bookly.dto.BusinessUpdateRequest;
import com.bookly.service.BusinessService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/businesses")
public class BusinessController {

    private final BusinessService businessService;

    public BusinessController(BusinessService businessService) {
        this.businessService = businessService;
    }

    @GetMapping("/me")
    public ResponseEntity<BusinessResponse> getCurrentBusiness() {
        return ResponseEntity.ok(businessService.getCurrentBusiness());
    }

    @PutMapping("/me")
    public ResponseEntity<BusinessResponse> updateCurrentBusiness(@Valid @RequestBody BusinessUpdateRequest request) {
        return ResponseEntity.ok(businessService.updateCurrentBusiness(request));
    }
}
