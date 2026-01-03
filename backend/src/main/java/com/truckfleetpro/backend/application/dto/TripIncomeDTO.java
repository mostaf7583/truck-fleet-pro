package com.truckfleetpro.backend.application.dto;

import lombok.Data;
import java.util.Date;

@Data
public class TripIncomeDTO {
    private String id;
    private String tripId;
    private String clientName;
    private Double amount;
    private String paymentStatus;
    private Date dueDate;
    private Date paidDate;
}
