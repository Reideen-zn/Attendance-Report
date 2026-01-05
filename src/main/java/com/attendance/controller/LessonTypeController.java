package com.attendance.controller;

import com.attendance.model.LessonType;
import com.attendance.service.LessonTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/lesson-types")
public class LessonTypeController {
    
    @Autowired
    private LessonTypeService lessonTypeService;
    
    @GetMapping
    public ResponseEntity<List<LessonType>> getAll() {
        return ResponseEntity.ok(lessonTypeService.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LessonType> getById(@PathVariable Long id) {
        Optional<LessonType> lessonType = lessonTypeService.getById(id);
        return lessonType.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<LessonType> create(@RequestBody LessonType lessonType) {
        LessonType created = lessonTypeService.create(lessonType);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<LessonType> update(@PathVariable Long id, @RequestBody LessonType lessonType) {
        LessonType updated = lessonTypeService.update(id, lessonType);
        if(updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if(lessonTypeService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
