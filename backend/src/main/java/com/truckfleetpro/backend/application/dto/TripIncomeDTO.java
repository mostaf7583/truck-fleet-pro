package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TripIncomeDTO {
    private String id;
    private String tripId;
    private String clientName;
    private Double amount;
    private String paymentStatus;
    private LocalDate dueDate;
    private LocalDate paidDate;
}
