package com.truckfleetpro.backend.domain.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, String> {
    List<MaintenanceRecord> findByTruckId(String truckId);

    List<MaintenanceRecord> findByType(MaintenanceRecord.MaintenanceType type);
}
