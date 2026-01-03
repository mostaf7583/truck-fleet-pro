package com.truckfleetpro.backend.domain.fuel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuelRecordRepository extends JpaRepository<FuelRecord, String> {
    List<FuelRecord> findByTruckId(String truckId);

    List<FuelRecord> findByTripId(String tripId);
}
