package com.attendance.service;

import com.attendance.model.Building;
import com.attendance.repository.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BuildingService {
    
    @Autowired
    private BuildingRepository buildingRepository;
    
    public List<Building> getAll() {
        return buildingRepository.findAll();
    }
    
    public Optional<Building> getById(Long id) {
        return buildingRepository.findById(id);
    }
    
    public Building create(Building building) {
        return buildingRepository.save(building);
    }
    
    public Building update(Long id, Building building) {
        if(buildingRepository.existsById(id)) {
            building.setId(id);
            return buildingRepository.save(building);
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if(buildingRepository.existsById(id)) {
            buildingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
