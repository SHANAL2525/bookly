package com.bookly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookly.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByBusiness_Id(Long businessId);

    boolean existsByBusiness_IdAndEmailIgnoreCase(Long businessId, String email);
}
