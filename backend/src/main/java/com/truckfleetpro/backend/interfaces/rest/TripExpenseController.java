package com.truckfleetpro.backend.interfaces.rest;

import com.truckfleetpro.backend.application.dto.TripExpenseDTO;
import com.truckfleetpro.backend.application.service.TripExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trip-expenses")
@RequiredArgsConstructor
public class TripExpenseController {

    private final TripExpenseService service;

    @GetMapping
    public ResponseEntity<List<TripExpenseDTO>> getAll() {
        return ResponseEntity.ok(service.getAllExpenses());
    }

    @PostMapping
    public ResponseEntity<TripExpenseDTO> create(@RequestBody TripExpenseDTO dto) {
        return ResponseEntity.ok(service.createExpense(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
