package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.util.Date;

@Data
public class MaintenanceRecordDTO {
    private String id;
    private String truckId;
    private String type;
    private String description;
    private Double cost;
    private Date date;
    private Date nextDueDate;
    private String vendor;
}
