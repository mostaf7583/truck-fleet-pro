package com.truckfleetpro.backend.interfaces.rest;

import com.truckfleetpro.backend.application.dto.FuelRecordDTO;
import com.truckfleetpro.backend.application.service.FuelRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fuel-records")
@RequiredArgsConstructor
public class FuelRecordController {

    private final FuelRecordService service;

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<FuelRecordDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getAllRecords(org.springframework.data.domain.PageRequest.of(page, size)));
    }

    @PostMapping
    public ResponseEntity<FuelRecordDTO> create(@RequestBody FuelRecordDTO dto) {
        return ResponseEntity.ok(service.createRecord(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
