package com.truckfleetpro.backend.interfaces.rest;

import com.truckfleetpro.backend.application.dto.FuelRecordDTO;
import com.truckfleetpro.backend.application.service.FuelRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-records")
@RequiredArgsConstructor
public class FuelRecordController {

    private final FuelRecordService service;

    @GetMapping
    public ResponseEntity<List<FuelRecordDTO>> getAll() {
        return ResponseEntity.ok(service.getAllRecords());
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
