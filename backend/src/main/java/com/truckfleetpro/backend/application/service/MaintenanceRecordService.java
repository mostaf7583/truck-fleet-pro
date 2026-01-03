package com.truckfleetpro.backend.application.service;

import com.truckfleetpro.backend.application.dto.MaintenanceRecordDTO;
import com.truckfleetpro.backend.domain.maintenance.MaintenanceRecord;
import com.truckfleetpro.backend.domain.maintenance.MaintenanceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.truckfleetpro.backend.domain.maintenance.MaintenanceType;

@Service
@RequiredArgsConstructor
public class MaintenanceRecordService {

    private final MaintenanceRecordRepository repository;

    public org.springframework.data.domain.Page<MaintenanceRecordDTO> getAllRecords(
            org.springframework.data.domain.Pageable pageable) {
        return repository.findAll(pageable)
                .map(this::mapToDTO);
    }

    public MaintenanceRecordDTO createRecord(MaintenanceRecordDTO dto) {
        MaintenanceRecord record = mapToEntity(dto);
        return mapToDTO(repository.save(record));
    }

    public void deleteRecord(String id) {
        repository.deleteById(id);
    }

    private MaintenanceRecordDTO mapToDTO(MaintenanceRecord r) {
        MaintenanceRecordDTO dto = new MaintenanceRecordDTO();
        dto.setId(r.getId());
        dto.setTruckId(r.getTruckId());
        dto.setType(r.getType().name());
        dto.setDescription(r.getDescription());
        dto.setCost(r.getCost());
        dto.setDate(r.getDate());
        dto.setNextDueDate(r.getNextDueDate());
        dto.setVendor(r.getVendor());
        return dto;
    }

    private MaintenanceRecord mapToEntity(MaintenanceRecordDTO dto) {
        return MaintenanceRecord.builder()
                .truckId(dto.getTruckId())
                .type(MaintenanceType.valueOf(dto.getType().toUpperCase()))
                .description(dto.getDescription())
                .cost(dto.getCost())
                .date(dto.getDate())
                .nextDueDate(dto.getNextDueDate())
                .vendor(dto.getVendor())
                .build();
    }
}
