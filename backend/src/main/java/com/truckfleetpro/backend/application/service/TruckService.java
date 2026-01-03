package com.truckfleetpro.backend.application.service;

import com.truckfleetpro.backend.application.dto.TruckDTO;
import com.truckfleetpro.backend.domain.truck.Truck;
import com.truckfleetpro.backend.domain.truck.TruckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.truckfleetpro.backend.domain.truck.TruckStatus;

@Service
@RequiredArgsConstructor
public class TruckService {

    private final TruckRepository truckRepository;

    public List<TruckDTO> getAllTrucks() {
        return truckRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TruckDTO getTruckById(String id) {
        Truck truck = truckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Truck not found"));
        return mapToDTO(truck);
    }

    @Transactional
    public TruckDTO createTruck(TruckDTO dto) {
        Truck truck = mapToEntity(dto);
        truck.setStatus(TruckStatus.ACTIVE); // Default
        return mapToDTO(truckRepository.save(truck));
    }

    @Transactional
    public TruckDTO updateTruck(String id, TruckDTO dto) {
        Truck truck = truckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Truck not found"));

        truck.setPlateNumber(dto.getPlateNumber());
        truck.setModel(dto.getModel());
        truck.setCapacity(dto.getCapacity());
        truck.setYear(dto.getYear());
        truck.setMileage(dto.getMileage());
        if (dto.getStatus() != null) {
            truck.setStatus(TruckStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        return mapToDTO(truckRepository.save(truck));
    }

    @Transactional
    public void deleteTruck(String id) {
        truckRepository.deleteById(id);
    }

    private TruckDTO mapToDTO(Truck truck) {
        TruckDTO dto = new TruckDTO();
        dto.setId(truck.getId());
        dto.setPlateNumber(truck.getPlateNumber());
        dto.setModel(truck.getModel());
        dto.setStatus(truck.getStatus().name());
        dto.setCapacity(truck.getCapacity());
        dto.setYear(truck.getYear());
        dto.setMileage(truck.getMileage());
        return dto;
    }

    private Truck mapToEntity(TruckDTO dto) {
        return Truck.builder()
                .plateNumber(dto.getPlateNumber())
                .model(dto.getModel())
                .capacity(dto.getCapacity())
                .year(dto.getYear())
                .mileage(dto.getMileage())
                .status(dto.getStatus() != null ? TruckStatus.valueOf(dto.getStatus().toUpperCase())
                        : TruckStatus.ACTIVE)
                .build();
    }
}
