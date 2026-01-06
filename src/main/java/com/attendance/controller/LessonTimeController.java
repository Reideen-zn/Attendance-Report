package com.attendance.controller;

import com.attendance.model.LessonTime;
import com.attendance.service.LessonTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/lesson-times")
public class LessonTimeController {
    
    @Autowired
    private LessonTimeService lessonTimeService;
    
    @GetMapping
    public ResponseEntity<List<LessonTime>> getAll() {
        return ResponseEntity.ok(lessonTimeService.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LessonTime> getById(@PathVariable Long id) {
        Optional<LessonTime> lessonTime = lessonTimeService.getById(id);
        return lessonTime.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<LessonTime> create(@RequestBody LessonTime lessonTime) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lessonTimeService.create(lessonTime));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<LessonTime> update(@PathVariable Long id, @RequestBody LessonTime lessonTime) {
        return ResponseEntity.ok(lessonTimeService.update(id, lessonTime));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lessonTimeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
