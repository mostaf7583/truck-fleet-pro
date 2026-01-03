package com.truckfleetpro.backend.domain.financial;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripIncomeRepository extends JpaRepository<TripIncome, String> {
    List<TripIncome> findByTripId(String tripId);

    List<TripIncome> findByPaymentStatus(PaymentStatus status);
}
