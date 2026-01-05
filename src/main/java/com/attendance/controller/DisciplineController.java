package com.attendance.controller;

import com.attendance.model.Discipline;
import com.attendance.service.DisciplineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/disciplines")
public class DisciplineController {
    
    @Autowired
    private DisciplineService disciplineService;
    
    @GetMapping
    public ResponseEntity<List<Discipline>> getAll() {
        return ResponseEntity.ok(disciplineService.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Discipline> getById(@PathVariable Long id) {
        Optional<Discipline> discipline = disciplineService.getById(id);
        return discipline.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Discipline> create(@RequestBody Discipline discipline) {
        Discipline created = disciplineService.create(discipline);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Discipline> update(@PathVariable Long id, @RequestBody Discipline discipline) {
        Discipline updated = disciplineService.update(id, discipline);
        if(updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if(disciplineService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
