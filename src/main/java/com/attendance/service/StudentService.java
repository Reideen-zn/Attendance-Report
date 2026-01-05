package com.attendance.service;

import com.attendance.model.Student;
import com.attendance.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Student> getAll() {
        return studentRepository.findAll();
    }
    
    public Optional<Student> getById(Long id) {
        return studentRepository.findById(id);
    }
    
    public Student create(Student student) {
        return studentRepository.save(student);
    }
    
    public Student update(Long id, Student student) {
        if(studentRepository.existsById(id)) {
            student.setId(id);
            return studentRepository.save(student);
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if(studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
