package com.truckfleetpro.backend.interfaces.rest;

import com.truckfleetpro.backend.application.dto.TruckDTO;
import com.truckfleetpro.backend.application.service.TruckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trucks")
@RequiredArgsConstructor
public class TruckController {

    private final TruckService truckService;

    @GetMapping
    public ResponseEntity<List<TruckDTO>> getAllTrucks() {
        return ResponseEntity.ok(truckService.getAllTrucks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TruckDTO> getTruckById(@PathVariable String id) {
        return ResponseEntity.ok(truckService.getTruckById(id));
    }

    @PostMapping
    public ResponseEntity<TruckDTO> createTruck(@RequestBody TruckDTO truckDTO) {
        return ResponseEntity.ok(truckService.createTruck(truckDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TruckDTO> updateTruck(@PathVariable String id, @RequestBody TruckDTO truckDTO) {
        return ResponseEntity.ok(truckService.updateTruck(id, truckDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTruck(@PathVariable String id) {
        truckService.deleteTruck(id);
        return ResponseEntity.noContent().build();
    }
}
