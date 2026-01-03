package com.truckfleetpro.backend.interfaces.rest;

import com.truckfleetpro.backend.application.dto.MaintenanceRecordDTO;
import com.truckfleetpro.backend.application.service.MaintenanceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-records")
@RequiredArgsConstructor
public class MaintenanceRecordController {

    private final MaintenanceRecordService service;

    @GetMapping
    public ResponseEntity<List<MaintenanceRecordDTO>> getAll() {
        return ResponseEntity.ok(service.getAllRecords());
    }

    @PostMapping
    public ResponseEntity<MaintenanceRecordDTO> create(@RequestBody MaintenanceRecordDTO dto) {
        return ResponseEntity.ok(service.createRecord(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
