package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TripExpenseDTO {
    private String id;
    private String tripId;
    private String type;
    private String description;
    private Double amount;
    private LocalDateTime date;
}
