package com.truckfleetpro.backend.application.service;

import com.truckfleetpro.backend.application.dto.DriverDTO;
import com.truckfleetpro.backend.domain.driver.Driver;
import com.truckfleetpro.backend.domain.driver.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.truckfleetpro.backend.domain.driver.DriverStatus;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public List<DriverDTO> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DriverDTO getDriverById(String id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        return mapToDTO(driver);
    }

    @Transactional
    public DriverDTO createDriver(DriverDTO dto) {
        Driver driver = mapToEntity(dto);
        if (driver.getStatus() == null) {
            driver.setStatus(DriverStatus.AVAILABLE);
        }
        return mapToDTO(driverRepository.save(driver));
    }

    @Transactional
    public DriverDTO updateDriver(String id, DriverDTO dto) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setFirstName(dto.getFirstName());
        driver.setLastName(dto.getLastName());
        driver.setLicenseNumber(dto.getLicenseNumber());
        driver.setLicenseExpiry(dto.getLicenseExpiry());
        driver.setPhone(dto.getPhone());
        driver.setEmail(dto.getEmail());
        driver.setAssignedTruckId(dto.getAssignedTruckId());

        if (dto.getStatus() != null) {
            driver.setStatus(DriverStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        return mapToDTO(driverRepository.save(driver));
    }

    @Transactional
    public void deleteDriver(String id) {
        driverRepository.deleteById(id);
    }

    private DriverDTO mapToDTO(Driver driver) {
        DriverDTO dto = new DriverDTO();
        dto.setId(driver.getId());
        dto.setFirstName(driver.getFirstName());
        dto.setLastName(driver.getLastName());
        dto.setLicenseNumber(driver.getLicenseNumber());
        dto.setLicenseExpiry(driver.getLicenseExpiry());
        dto.setPhone(driver.getPhone());
        dto.setEmail(driver.getEmail());
        dto.setAssignedTruckId(driver.getAssignedTruckId());
        if (driver.getStatus() != null) {
            dto.setStatus(driver.getStatus().name());
        }
        return dto;
    }

    private Driver mapToEntity(DriverDTO dto) {
        return Driver.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .licenseNumber(dto.getLicenseNumber())
                .licenseExpiry(dto.getLicenseExpiry())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .assignedTruckId(dto.getAssignedTruckId())
                .status(dto.getStatus() != null ? DriverStatus.valueOf(dto.getStatus().toUpperCase())
                        : DriverStatus.AVAILABLE)
                .build();
    }
}
