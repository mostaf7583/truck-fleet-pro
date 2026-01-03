package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DriverDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String licenseNumber;
    private LocalDate licenseExpiry;
    private String phone;
    private String email;
    private String assignedTruckId;
    private String status;
}
