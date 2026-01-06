package com.attendance.controller;

import com.attendance.model.Attendance;
import com.attendance.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @GetMapping
    public ResponseEntity<List<Attendance>> getAll() {
        return ResponseEntity.ok(attendanceService.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getById(@PathVariable Long id) {
        Optional<Attendance> attendance = attendanceService.getById(id);
        return attendance.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Attendance> create(@RequestBody Attendance attendance) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.create(attendance));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Attendance> update(@PathVariable Long id, @RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.update(id, attendance));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        attendanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
