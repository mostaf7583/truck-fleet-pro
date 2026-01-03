package com.truckfleetpro.backend.domain.financial;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripExpenseRepository extends JpaRepository<TripExpense, String> {
    List<TripExpense> findByTripId(String tripId);
}
