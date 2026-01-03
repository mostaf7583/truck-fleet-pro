package com.truckfleetpro.backend.application.service;

import com.truckfleetpro.backend.application.dto.FuelRecordDTO;
import com.truckfleetpro.backend.domain.fuel.FuelRecord;
import com.truckfleetpro.backend.domain.fuel.FuelRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FuelRecordService {

    private final FuelRecordRepository repository;

    public List<FuelRecordDTO> getAllRecords() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public FuelRecordDTO createRecord(FuelRecordDTO dto) {
        FuelRecord record = mapToEntity(dto);
        return mapToDTO(repository.save(record));
    }

    public void deleteRecord(String id) {
        repository.deleteById(id);
    }

    public List<FuelRecordDTO> getByTruckId(String truckId) {
        return repository.findByTruckId(truckId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private FuelRecordDTO mapToDTO(FuelRecord r) {
        FuelRecordDTO dto = new FuelRecordDTO();
        dto.setId(r.getId());
        dto.setTruckId(r.getTruckId());
        dto.setTripId(r.getTripId());
        dto.setAmount(r.getAmount());
        dto.setCost(r.getCost());
        dto.setDate(r.getDate());
        dto.setStation(r.getStation());
        dto.setOdometerReading(r.getOdometerReading());
        return dto;
    }

    private FuelRecord mapToEntity(FuelRecordDTO dto) {
        return FuelRecord.builder()
                .truckId(dto.getTruckId())
                .tripId(dto.getTripId())
                .amount(dto.getAmount())
                .cost(dto.getCost())
                .date(dto.getDate())
                .station(dto.getStation())
                .odometerReading(dto.getOdometerReading())
                .build();
    }
}
