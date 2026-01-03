package com.truckfleetpro.backend.interfaces.rest;

import com.truckfleetpro.backend.application.dto.MaintenanceRecordDTO;
import com.truckfleetpro.backend.application.service.MaintenanceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance-records")
@RequiredArgsConstructor
public class MaintenanceRecordController {

    private final MaintenanceRecordService service;

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<MaintenanceRecordDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getAllRecords(org.springframework.data.domain.PageRequest.of(page, size)));
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
