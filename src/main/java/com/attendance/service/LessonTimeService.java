package com.attendance.service;

import com.attendance.model.LessonTime;
import com.attendance.repository.LessonTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LessonTimeService {
    
    @Autowired
    private LessonTimeRepository lessonTimeRepository;
    
    public List<LessonTime> getAll() {
        return lessonTimeRepository.findAll();
    }
    
    public Optional<LessonTime> getById(Long id) {
        return lessonTimeRepository.findById(id);
    }
    
    public LessonTime create(LessonTime lessonTime) {
        return lessonTimeRepository.save(lessonTime);
    }
    
    public LessonTime update(Long id, LessonTime lessonTime) {
        lessonTime.setId(id);
        return lessonTimeRepository.save(lessonTime);
    }
    
    public void delete(Long id) {
        lessonTimeRepository.deleteById(id);
    }
}
