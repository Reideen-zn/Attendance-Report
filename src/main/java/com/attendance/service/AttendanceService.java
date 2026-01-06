package com.attendance.service;

import com.attendance.model.Attendance;
import com.attendance.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    public List<Attendance> getAll() {
        return attendanceRepository.findAll();
    }
    
    public Optional<Attendance> getById(Long id) {
        return attendanceRepository.findById(id);
    }
    
    public Attendance create(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }
    
    public Attendance update(Long id, Attendance attendance) {
        attendance.setId(id);
        return attendanceRepository.save(attendance);
    }
    
    public void delete(Long id) {
        attendanceRepository.deleteById(id);
    }
}
