package com.attendance.repository;

import com.attendance.model.LessonTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonTimeRepository extends JpaRepository<LessonTime, Long> {
}
