package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.util.Date;

@Data
public class TripDTO {
    private String id;
    private String origin;
    private String destination;
    private Date startDate;
    private Date endDate;
    private String driverId;
    private String truckId;
    private String status;
    private Double distance;
    private String clientName;
}
