package com.bookly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookly.entity.ServiceItem;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {

    List<ServiceItem> findByBusiness_Id(Long businessId);

    boolean existsByBusiness_IdAndNameIgnoreCase(Long businessId, String name);
}
