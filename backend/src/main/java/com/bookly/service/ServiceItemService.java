package com.bookly.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookly.dto.ServiceRequest;
import com.bookly.dto.ServiceResponse;
import com.bookly.entity.Business;
import com.bookly.entity.ServiceItem;
import com.bookly.exception.BadRequestException;
import com.bookly.exception.ResourceNotFoundException;
import com.bookly.repository.ServiceItemRepository;

@Service
public class ServiceItemService {

    private final ServiceItemRepository serviceItemRepository;
    private final CurrentUserService currentUserService;

    public ServiceItemService(ServiceItemRepository serviceItemRepository, CurrentUserService currentUserService) {
        this.serviceItemRepository = serviceItemRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        Business business = currentUserService.getCurrentBusiness();
        return serviceItemRepository.findByBusiness_Id(business.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        return toResponse(getOwnedService(id));
    }

    @Transactional
    public ServiceResponse createService(ServiceRequest request) {
        Business business = currentUserService.getCurrentBusiness();
        if (serviceItemRepository.existsByBusiness_IdAndNameIgnoreCase(business.getId(), request.getName().trim())) {
            throw new BadRequestException("A service with this name already exists.");
        }

        ServiceItem serviceItem = new ServiceItem();
        serviceItem.setName(request.getName().trim());
        serviceItem.setDescription(request.getDescription());
        serviceItem.setPrice(request.getPrice());
        serviceItem.setDurationMinutes(request.getDurationMinutes());
        serviceItem.setBusiness(business);
        return toResponse(serviceItemRepository.save(serviceItem));
    }

    @Transactional
    public ServiceResponse updateService(Long id, ServiceRequest request) {
        ServiceItem serviceItem = getOwnedService(id);
        serviceItem.setName(request.getName().trim());
        serviceItem.setDescription(request.getDescription());
        serviceItem.setPrice(request.getPrice());
        serviceItem.setDurationMinutes(request.getDurationMinutes());
        return toResponse(serviceItem);
    }

    @Transactional
    public void deleteService(Long id) {
        ServiceItem serviceItem = getOwnedService(id);
        serviceItemRepository.delete(serviceItem);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getPublicServices(Long businessId) {
        return serviceItemRepository.findByBusiness_Id(businessId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServiceItem getServiceForBusiness(Long serviceId, Long businessId) {
        ServiceItem serviceItem = serviceItemRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found."));
        if (!serviceItem.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Service not found.");
        }
        return serviceItem;
    }

    private ServiceItem getOwnedService(Long id) {
        Business business = currentUserService.getCurrentBusiness();
        return getServiceForBusiness(id, business.getId());
    }

    private ServiceResponse toResponse(ServiceItem serviceItem) {
        return new ServiceResponse(
                serviceItem.getId(),
                serviceItem.getName(),
                serviceItem.getDescription(),
                serviceItem.getPrice(),
                serviceItem.getDurationMinutes(),
                serviceItem.getBusiness().getId()
        );
    }
}
