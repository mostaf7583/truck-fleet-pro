package com.truckfleetpro.backend.application.service;

import com.truckfleetpro.backend.application.dto.DashboardStatsDTO;
import com.truckfleetpro.backend.domain.driver.Driver;
import com.truckfleetpro.backend.domain.driver.DriverRepository;
import com.truckfleetpro.backend.domain.financial.TripExpense;
import com.truckfleetpro.backend.domain.financial.TripExpenseRepository;
import com.truckfleetpro.backend.domain.financial.TripIncome;
import com.truckfleetpro.backend.domain.financial.TripIncomeRepository;
import com.truckfleetpro.backend.domain.fuel.FuelRecord;
import com.truckfleetpro.backend.domain.fuel.FuelRecordRepository;
import com.truckfleetpro.backend.domain.maintenance.MaintenanceRecord;
import com.truckfleetpro.backend.domain.maintenance.MaintenanceRecordRepository;
import com.truckfleetpro.backend.domain.trip.Trip;
import com.truckfleetpro.backend.domain.trip.TripRepository;
import com.truckfleetpro.backend.domain.truck.Truck;
import com.truckfleetpro.backend.domain.truck.TruckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TruckRepository truckRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final FuelRecordRepository fuelRepository;
    private final MaintenanceRecordRepository maintenanceRepository;
    private final TripExpenseRepository expenseRepository;
    private final TripIncomeRepository incomeRepository;

    public DashboardStatsDTO getDashboardStats() {
        // This is a naive implementation fetching all data.
        // In production, optimized JPQL/SQL queries should be used.

        List<TripIncome> incomes = incomeRepository.findAll();
        List<FuelRecord> fuelRecords = fuelRepository.findAll();
        List<MaintenanceRecord> maintenanceRecords = maintenanceRepository.findAll();
        List<TripExpense> tripExpenses = expenseRepository.findAll();

        double totalRevenue = incomes.stream().mapToDouble(TripIncome::getAmount).sum();
        double totalFuelCost = fuelRecords.stream().mapToDouble(FuelRecord::getCost).sum();
        double totalMaintenanceCost = maintenanceRecords.stream().mapToDouble(MaintenanceRecord::getCost).sum();
        double totalTripExpenses = tripExpenses.stream().mapToDouble(TripExpense::getAmount).sum();

        double totalExpenses = totalFuelCost + totalMaintenanceCost + totalTripExpenses;

        long activeTrips = tripRepository.findByStatus(Trip.TripStatus.IN_PROGRESS).size();

        // Naive active trucks count (since we don't have a status query method in repo
        // yet, let's filter)
        long activeTrucks = truckRepository.findAll().stream()
                .filter(t -> t.getStatus() == Truck.TruckStatus.ACTIVE)
                .count();

        // Naive available drivers count
        long availableDrivers = driverRepository.findAll().stream()
                .filter(d -> d.getStatus() == Driver.DriverStatus.AVAILABLE)
                .count();

        double pendingPayments = incomes.stream()
                .filter(i -> i.getPaymentStatus() == TripIncome.PaymentStatus.PENDING)
                .mapToDouble(TripIncome::getAmount)
                .sum();

        return DashboardStatsDTO.builder()
                .totalRevenue(totalRevenue)
                .totalExpenses(totalExpenses)
                .netProfit(totalRevenue - totalExpenses)
                .activeTrips(activeTrips)
                .activeTrucks(activeTrucks)
                .availableDrivers(availableDrivers)
                .pendingPayments(pendingPayments)
                .build();
    }
}
