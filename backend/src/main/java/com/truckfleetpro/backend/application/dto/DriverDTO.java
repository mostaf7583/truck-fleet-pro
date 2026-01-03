package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.util.Date;

@Data
public class DriverDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String licenseNumber;
    private Date licenseExpiry;
    private String phone;
    private String email;
    private String assignedTruckId;
    private String status;
}
