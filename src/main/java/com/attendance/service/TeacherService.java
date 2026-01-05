package com.attendance.service;

import com.attendance.model.Teacher;
import com.attendance.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    public List<Teacher> getAll() {
        return teacherRepository.findAll();
    }
    
    public Optional<Teacher> getById(Long id) {
        return teacherRepository.findById(id);
    }
    
    public Teacher create(Teacher teacher) {
        return teacherRepository.save(teacher);
    }
    
    public Teacher update(Long id, Teacher teacher) {
        if(teacherRepository.existsById(id)) {
            teacher.setId(id);
            return teacherRepository.save(teacher);
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if(teacherRepository.existsById(id)) {
            teacherRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
