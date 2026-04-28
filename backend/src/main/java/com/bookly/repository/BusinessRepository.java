package com.bookly.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookly.entity.Business;

public interface BusinessRepository extends JpaRepository<Business, Long> {

    Optional<Business> findByOwnerUserId(Long ownerUserId);

    boolean existsByOwnerUserId(Long ownerUserId);
}
