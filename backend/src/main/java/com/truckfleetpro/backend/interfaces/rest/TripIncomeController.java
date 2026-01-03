package com.truckfleetpro.backend.interfaces.rest;

import com.truckfleetpro.backend.application.dto.TripIncomeDTO;
import com.truckfleetpro.backend.application.service.TripIncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trip-incomes")
@RequiredArgsConstructor
public class TripIncomeController {

    private final TripIncomeService service;

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<TripIncomeDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getAllIncomes(org.springframework.data.domain.PageRequest.of(page, size)));
    }

    @PostMapping
    public ResponseEntity<TripIncomeDTO> create(@RequestBody TripIncomeDTO dto) {
        return ResponseEntity.ok(service.createIncome(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }
}
