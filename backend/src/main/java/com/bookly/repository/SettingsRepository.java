package com.bookly.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookly.entity.Settings;

public interface SettingsRepository extends JpaRepository<Settings, Long> {

    Optional<Settings> findByBusiness_Id(Long businessId);
}
