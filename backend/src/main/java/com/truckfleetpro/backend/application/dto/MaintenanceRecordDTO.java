package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MaintenanceRecordDTO {
    private String id;
    private String truckId;
    private String type;
    private String description;
    private Double cost;
    private LocalDateTime date;
    private LocalDate nextDueDate;
    private String vendor;
}
