package com.truckfleetpro.backend.application.service;

import com.truckfleetpro.backend.application.dto.TripIncomeDTO;
import com.truckfleetpro.backend.domain.financial.TripIncome;
import com.truckfleetpro.backend.domain.financial.TripIncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.truckfleetpro.backend.domain.financial.PaymentStatus;

@Service
@RequiredArgsConstructor
public class TripIncomeService {

    private final TripIncomeRepository repository;

    public org.springframework.data.domain.Page<TripIncomeDTO> getAllIncomes(
            org.springframework.data.domain.Pageable pageable) {
        return repository.findAll(pageable)
                .map(this::mapToDTO);
    }

    public TripIncomeDTO createIncome(TripIncomeDTO dto) {
        TripIncome income = mapToEntity(dto);
        // Default to PENDING if not set
        if (income.getPaymentStatus() == null) {
            income.setPaymentStatus(PaymentStatus.PENDING);
        }
        return mapToDTO(repository.save(income));
    }

    public void deleteIncome(String id) {
        repository.deleteById(id);
    }

    public TripIncomeDTO updatePaymentStatus(String id, String status) {
        TripIncome income = repository.findById(id).orElseThrow(() -> new RuntimeException("Income not found"));
        income.setPaymentStatus(PaymentStatus.valueOf(status.toUpperCase()));
        return mapToDTO(repository.save(income));
    }

    private TripIncomeDTO mapToDTO(TripIncome i) {
        TripIncomeDTO dto = new TripIncomeDTO();
        dto.setId(i.getId());
        dto.setTripId(i.getTripId());
        dto.setClientName(i.getClientName());
        dto.setAmount(i.getAmount());
        dto.setPaymentStatus(i.getPaymentStatus().name());
        dto.setDueDate(i.getDueDate());
        dto.setPaidDate(i.getPaidDate());
        return dto;
    }

    private TripIncome mapToEntity(TripIncomeDTO dto) {
        return TripIncome.builder()
                .tripId(dto.getTripId())
                .clientName(dto.getClientName())
                .amount(dto.getAmount())
                .paymentStatus(dto.getPaymentStatus() != null
                        ? PaymentStatus.valueOf(dto.getPaymentStatus().toUpperCase())
                        : PaymentStatus.PENDING)
                .dueDate(dto.getDueDate())
                .paidDate(dto.getPaidDate())
                .build();
    }
}
