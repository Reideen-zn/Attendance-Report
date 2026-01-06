package com.attendance.controller;

import com.attendance.dto.WordExportRequest;
import com.attendance.model.Attendance;
import com.attendance.service.AttendanceService;
import com.attendance.util.WordExportUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @Autowired
    private WordExportUtil wordExportUtil;
    
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
    
    @PostMapping("/export-word")
    public ResponseEntity<?> exportMissesReportToWord(@RequestBody WordExportRequest request) {
        try {
            File exportedFile = wordExportUtil.exportMissesReport(
                request.getDateFrom(),
                request.getDateTo(),
                request.getGroupId()
            );
            
            byte[] fileContent = Files.readAllBytes(exportedFile.toPath());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + exportedFile.getName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при экспорте в Word: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + e.getMessage());
        }
    }
}

