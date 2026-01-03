package com.truckfleetpro.backend.application.service;

import com.truckfleetpro.backend.application.dto.TripExpenseDTO;
import com.truckfleetpro.backend.domain.financial.TripExpense;
import com.truckfleetpro.backend.domain.financial.TripExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripExpenseService {

    private final TripExpenseRepository repository;

    public List<TripExpenseDTO> getAllExpenses() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public TripExpenseDTO createExpense(TripExpenseDTO dto) {
        TripExpense expense = mapToEntity(dto);
        return mapToDTO(repository.save(expense));
    }

    public void deleteExpense(String id) {
        repository.deleteById(id);
    }

    private TripExpenseDTO mapToDTO(TripExpense e) {
        TripExpenseDTO dto = new TripExpenseDTO();
        dto.setId(e.getId());
        dto.setTripId(e.getTripId());
        dto.setType(e.getType().name());
        dto.setDescription(e.getDescription());
        dto.setAmount(e.getAmount());
        dto.setDate(e.getDate());
        return dto;
    }

    private TripExpense mapToEntity(TripExpenseDTO dto) {
        return TripExpense.builder()
                .tripId(dto.getTripId())
                .type(TripExpense.ExpenseType.valueOf(dto.getType().toUpperCase()))
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .build();
    }
}
