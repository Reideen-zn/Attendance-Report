package com.attendance.service;

import com.attendance.model.Discipline;
import com.attendance.repository.DisciplineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DisciplineService {
    
    @Autowired
    private DisciplineRepository disciplineRepository;
    
    public List<Discipline> getAll() {
        return disciplineRepository.findAll();
    }
    
    public Optional<Discipline> getById(Long id) {
        return disciplineRepository.findById(id);
    }
    
    public Discipline create(Discipline discipline) {
        return disciplineRepository.save(discipline);
    }
    
    public Discipline update(Long id, Discipline discipline) {
        if(disciplineRepository.existsById(id)) {
            discipline.setId(id);
            return disciplineRepository.save(discipline);
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if(disciplineRepository.existsById(id)) {
            disciplineRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
