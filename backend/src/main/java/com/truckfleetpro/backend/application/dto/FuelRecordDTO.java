package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FuelRecordDTO {
    private String id;
    private String truckId;
    private String tripId;
    private Double amount;
    private Double cost;
    private LocalDateTime date;
    private String station;
    private Double odometerReading;
}
