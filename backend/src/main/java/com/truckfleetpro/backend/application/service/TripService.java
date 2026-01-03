package com.truckfleetpro.backend.application.service;

import com.truckfleetpro.backend.application.dto.TripDTO;
import com.truckfleetpro.backend.domain.trip.Trip;
import com.truckfleetpro.backend.domain.trip.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;

    public List<TripDTO> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TripDTO getTripById(String id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        return mapToDTO(trip);
    }

    @Transactional
    public TripDTO createTrip(TripDTO dto) {
        Trip trip = mapToEntity(dto);
        if (trip.getStatus() == null) {
            trip.setStatus(Trip.TripStatus.SCHEDULED);
        }
        return mapToDTO(tripRepository.save(trip));
    }

    @Transactional
    public TripDTO updateTrip(String id, TripDTO dto) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        trip.setOrigin(dto.getOrigin());
        trip.setDestination(dto.getDestination());
        trip.setStartDate(dto.getStartDate());
        trip.setEndDate(dto.getEndDate());
        trip.setDriverId(dto.getDriverId());
        trip.setTruckId(dto.getTruckId());
        trip.setDistance(dto.getDistance());
        trip.setClientName(dto.getClientName());

        if (dto.getStatus() != null) {
            trip.setStatus(Trip.TripStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        return mapToDTO(tripRepository.save(trip));
    }

    @Transactional
    public void deleteTrip(String id) {
        tripRepository.deleteById(id);
    }

    @Transactional
    public TripDTO updateStatus(String id, String status) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        trip.setStatus(Trip.TripStatus.valueOf(status.toUpperCase()));
        return mapToDTO(tripRepository.save(trip));
    }

    private TripDTO mapToDTO(Trip trip) {
        TripDTO dto = new TripDTO();
        dto.setId(trip.getId());
        dto.setOrigin(trip.getOrigin());
        dto.setDestination(trip.getDestination());
        dto.setStartDate(trip.getStartDate());
        dto.setEndDate(trip.getEndDate());
        dto.setDriverId(trip.getDriverId());
        dto.setTruckId(trip.getTruckId());
        dto.setDistance(trip.getDistance());
        dto.setClientName(trip.getClientName());
        if (trip.getStatus() != null) {
            dto.setStatus(trip.getStatus().name());
        }
        return dto;
    }

    private Trip mapToEntity(TripDTO dto) {
        return Trip.builder()
                .origin(dto.getOrigin())
                .destination(dto.getDestination())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .driverId(dto.getDriverId())
                .truckId(dto.getTruckId())
                .distance(dto.getDistance())
                .clientName(dto.getClientName())
                .status(dto.getStatus() != null ? Trip.TripStatus.valueOf(dto.getStatus().toUpperCase())
                        : Trip.TripStatus.SCHEDULED)
                .build();
    }
}
