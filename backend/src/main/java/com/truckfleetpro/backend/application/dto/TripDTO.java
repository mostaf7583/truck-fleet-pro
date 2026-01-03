package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TripDTO {
    private String id;
    private String origin;
    private String destination;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String driverId;
    private String truckId;
    private String status;
    private Double distance;
    private String clientName;
}
