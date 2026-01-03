package com.truckfleetpro.backend.domain.trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    List<Trip> findByDriverId(String driverId);

    List<Trip> findByTruckId(String truckId);

    List<Trip> findByStatus(TripStatus status);
}
