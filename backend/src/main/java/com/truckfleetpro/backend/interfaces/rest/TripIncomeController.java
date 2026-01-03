package com.truckfleetpro.backend.interfaces.rest;

import com.truckfleetpro.backend.application.dto.TripIncomeDTO;
import com.truckfleetpro.backend.application.service.TripIncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trip-incomes")
@RequiredArgsConstructor
public class TripIncomeController {

    private final TripIncomeService service;

    @GetMapping
    public ResponseEntity<List<TripIncomeDTO>> getAll() {
        return ResponseEntity.ok(service.getAllIncomes());
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
