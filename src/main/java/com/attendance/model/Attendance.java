package com.attendance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;
    
    @ManyToOne
    @JoinColumn(name = "discipline_id", nullable = false)
    private Discipline discipline;
    
    @ManyToOne
    @JoinColumn(name = "lesson_type_id", nullable = false)
    private LessonType lessonType;
    
    @ManyToOne
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;
    
    @ManyToOne
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;
    
    @Column(nullable = false)
    private Boolean present;
    
    @Column(nullable = false)
    private String attendanceDate;
    
    @ManyToOne
    @JoinColumn(name = "attendance_time_id", nullable = false)
    private LessonTime attendanceTime;
    
    @Column(nullable = false)
    private Integer missedHours = 2;
}
