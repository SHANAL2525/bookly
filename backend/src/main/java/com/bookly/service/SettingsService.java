package com.bookly.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookly.dto.SettingsRequest;
import com.bookly.dto.SettingsResponse;
import com.bookly.entity.Business;
import com.bookly.entity.Settings;
import com.bookly.repository.SettingsRepository;

@Service
public class SettingsService {

    private final SettingsRepository settingsRepository;
    private final CurrentUserService currentUserService;

    public SettingsService(SettingsRepository settingsRepository, CurrentUserService currentUserService) {
        this.settingsRepository = settingsRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public SettingsResponse getCurrentSettings() {
        Business business = currentUserService.getCurrentBusiness();
        Settings settings = settingsRepository.findByBusiness_Id(business.getId())
                .orElseGet(() -> createDefaultSettings(business));
        return toResponse(settings);
    }

    @Transactional
    public SettingsResponse updateSettings(SettingsRequest request) {
        Business business = currentUserService.getCurrentBusiness();
        Settings settings = settingsRepository.findByBusiness_Id(business.getId())
                .orElseGet(() -> createDefaultSettings(business));

        settings.setBusinessHours(request.getBusinessHours().trim());
        settings.setBookingBufferMinutes(request.getBookingBufferMinutes());
        settings.setCancellationPolicy(request.getCancellationPolicy().trim());
        settings.setAllowOnlinePayments(request.getAllowOnlinePayments());

        return toResponse(settingsRepository.save(settings));
    }

    private Settings createDefaultSettings(Business business) {
        Settings settings = new Settings();
        settings.setBusiness(business);
        settings.setBusinessHours("09:00 - 17:00");
        settings.setBookingBufferMinutes(10);
        settings.setCancellationPolicy("Bookings can be cancelled up to 24 hours before the appointment.");
        settings.setAllowOnlinePayments(Boolean.FALSE);
        return settingsRepository.save(settings);
    }

    private SettingsResponse toResponse(Settings settings) {
        return new SettingsResponse(
                settings.getId(),
                settings.getBusinessHours(),
                settings.getBookingBufferMinutes(),
                settings.getCancellationPolicy(),
                settings.getAllowOnlinePayments(),
                settings.getBusiness().getId()
        );
    }
}
