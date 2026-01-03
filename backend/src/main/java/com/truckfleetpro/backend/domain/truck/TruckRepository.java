package com.truckfleetpro.backend.domain.truck;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TruckRepository extends JpaRepository<Truck, String> {
    Optional<Truck> findByPlateNumber(String plateNumber);
}
