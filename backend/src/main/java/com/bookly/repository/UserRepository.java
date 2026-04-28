package com.bookly.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookly.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);
}
