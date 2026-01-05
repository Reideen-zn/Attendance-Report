package com.attendance.controller;

import com.attendance.model.Building;
import com.attendance.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/buildings")
public class BuildingController {
    
    @Autowired
    private BuildingService buildingService;
    
    @GetMapping
    public ResponseEntity<List<Building>> getAll() {
        return ResponseEntity.ok(buildingService.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Building> getById(@PathVariable Long id) {
        Optional<Building> building = buildingService.getById(id);
        return building.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Building> create(@RequestBody Building building) {
        Building created = buildingService.create(building);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Building> update(@PathVariable Long id, @RequestBody Building building) {
        Building updated = buildingService.update(id, building);
        if(updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if(buildingService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
