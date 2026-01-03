package com.truckfleetpro.backend.domain.driver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {
    Optional<Driver> findByLicenseNumber(String licenseNumber);

    Optional<Driver> findByEmail(String email);
}
