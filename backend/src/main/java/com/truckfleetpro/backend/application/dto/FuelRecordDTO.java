package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.util.Date;

@Data
public class FuelRecordDTO {
    private String id;
    private String truckId;
    private String tripId;
    private Double amount;
    private Double cost;
    private Date date;
    private String station;
    private Double odometerReading;
}
