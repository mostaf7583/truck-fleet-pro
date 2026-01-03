package com.truckfleetpro.backend.application.dto;

import lombok.Data;

@Data
public class TruckDTO {
    private String id;
    private String plateNumber;
    private String model;
    private String status;
    private Double capacity;
    private Integer year;
    private Double mileage;
}
