package com.attendance.service;

import com.attendance.model.LessonType;
import com.attendance.repository.LessonTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LessonTypeService {
    
    @Autowired
    private LessonTypeRepository lessonTypeRepository;
    
    public List<LessonType> getAll() {
        return lessonTypeRepository.findAll();
    }
    
    public Optional<LessonType> getById(Long id) {
        return lessonTypeRepository.findById(id);
    }
    
    public LessonType create(LessonType lessonType) {
        return lessonTypeRepository.save(lessonType);
    }
    
    public LessonType update(Long id, LessonType lessonType) {
        if(lessonTypeRepository.existsById(id)) {
            lessonType.setId(id);
            return lessonTypeRepository.save(lessonType);
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if(lessonTypeRepository.existsById(id)) {
            lessonTypeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
