package com.attendance.service;

import com.attendance.model.Classroom;
import com.attendance.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClassroomService {
    
    @Autowired
    private ClassroomRepository classroomRepository;
    
    public List<Classroom> getAll() {
        return classroomRepository.findAll();
    }
    
    public Optional<Classroom> getById(Long id) {
        return classroomRepository.findById(id);
    }
    
    public Classroom create(Classroom classroom) {
        return classroomRepository.save(classroom);
    }
    
    public Classroom update(Long id, Classroom classroom) {
        if(classroomRepository.existsById(id)) {
            classroom.setId(id);
            return classroomRepository.save(classroom);
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if(classroomRepository.existsById(id)) {
            classroomRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
