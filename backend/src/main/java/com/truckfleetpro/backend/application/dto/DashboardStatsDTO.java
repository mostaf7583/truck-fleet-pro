package com.truckfleetpro.backend.application.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    private Double totalRevenue;
    private Double totalExpenses;
    private Double netProfit;
    private Long activeTrips;
    private Long activeTrucks;
    private Long availableDrivers;
    private Double pendingPayments;
}
