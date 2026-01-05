package com.attendance.service;

import com.attendance.model.Group;
import com.attendance.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GroupService {
    
    @Autowired
    private GroupRepository groupRepository;
    
    public List<Group> getAll() {
        return groupRepository.findAll();
    }
    
    public Optional<Group> getById(Long id) {
        return groupRepository.findById(id);
    }
    
    public Group create(Group group) {
        return groupRepository.save(group);
    }
    
    public Group update(Long id, Group group) {
        if(groupRepository.existsById(id)) {
            group.setId(id);
            return groupRepository.save(group);
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if(groupRepository.existsById(id)) {
            groupRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
