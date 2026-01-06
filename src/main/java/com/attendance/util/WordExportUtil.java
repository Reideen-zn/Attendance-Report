package com.attendance.util;

import com.attendance.model.*;
import com.attendance.repository.*;
import com.deepoove.poi.data.TableRenderData;
import com.deepoove.poi.data.Tables;
import com.deepoove.poi.data.Rows;
import com.deepoove.poi.data.RowRenderData;
import com.deepoove.poi.XWPFTemplate;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import com.deepoove.poi.config.Configure;
import com.deepoove.poi.policy.TableRenderPolicy;

@Component
public class WordExportUtil {
    
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;
    
    public WordExportUtil(AttendanceRepository attendanceRepository,
                         StudentRepository studentRepository,
                         GroupRepository groupRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
    }
    
    public File exportMissesReport(String dateFrom, String dateTo, Long groupId) throws IOException {
        // Получаем шаблон из classpath ресурсов
        ClassPathResource resource = new ClassPathResource("static/pattern/pattern.docx");
        InputStream templateInputStream = resource.getInputStream();
        
        // Парсим даты
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        LocalDate fromDate = LocalDate.parse(dateFrom, formatter);
        LocalDate toDate = LocalDate.parse(dateTo, formatter);
        
        // Текущая дата
        LocalDate today = LocalDate.now();
        String todayFormatted = today.format(formatter);
        
        // Получаем все записи посещаемости
        List<Attendance> allAttendance = attendanceRepository.findAll();
        
        // Фильтруем студентов
        List<Student> students = new ArrayList<>(studentRepository.findAll());
        Group selectedGroup = null;
        
        if(groupId != null) {
            Optional<Group> groupOpt = groupRepository.findById(groupId);
            if(groupOpt.isPresent()) {
                selectedGroup = groupOpt.get();
                students = students.stream()
                        .filter(s -> s.getGroup() != null && s.getGroup().getId().equals(groupId))
                        .collect(Collectors.toList());
            }
        }
        
        // Фильтруем записи по датам и пропускам
        List<Attendance> missedRecords = new ArrayList<>();
        for(Attendance record : allAttendance) {
            if(!record.getPresent()) {
                LocalDate recordDate = LocalDate.parse(record.getAttendanceDate(), formatter);
                if(!recordDate.isBefore(fromDate) && !recordDate.isAfter(toDate)) {
                    // Если выбрана группа, фильтруем по ней
                    if(groupId == null || (record.getStudent().getGroup() != null && 
                        record.getStudent().getGroup().getId().equals(groupId))) {
                        missedRecords.add(record);
                    }
                }
            }
        }
        
        // Группируем по студентам
        Map<Student, List<Attendance>> studentMisses = new HashMap<>();
        for(Attendance record : missedRecords) {
            studentMisses.computeIfAbsent(record.getStudent(), k -> new ArrayList<>()).add(record);
        }
        
        // Генерируем таблицу
        List<RowRenderData> rows = new ArrayList<>();
        
        // Заголовок таблицы
        rows.add(Rows.of(
            "ФИО студента",
            "№ группы",
            "Дисциплина",
            "Вид занятия, аудитория, корпус",
            "Дата",
            "Время",
            "Кол-во пропущенных часов"
        ).create());
        
        // Данные таблицы
        for(Student student : students) {
            if(studentMisses.containsKey(student)) {
                List<Attendance> recordList = studentMisses.get(student);
                int totalHours = recordList.stream()
                        .mapToInt(r -> r.getMissedHours() != null ? r.getMissedHours() : 0)
                        .sum();
                
                for(int i = 0; i < recordList.size(); i++) {
                    Attendance record = recordList.get(i);
                    String lessonInfo = record.getLessonType().getName() + ", " +
                            record.getClassroom().getNumber() + ", " +
                            record.getBuilding().getName();
                    
                    String studentName = i == 0 ? student.getLastName() + " " + student.getFirstName() : "";
                    String groupName = i == 0 ? student.getGroup().getName() : "";
                    
                    rows.add(Rows.of(
                        studentName,
                        groupName,
                        record.getDiscipline().getName(),
                        lessonInfo,
                        record.getAttendanceDate(),
                        record.getAttendanceTime().getTime(),
                        String.valueOf(record.getMissedHours() != null ? record.getMissedHours() : 0)
                    ).create());
                }
                
                // Итоговая строка
                rows.add(Rows.of(
                    "", "", "", "",
                    "",
                    "Всего пропущено часов:",
                    String.valueOf(totalHours)
                ).create());
            }
        }
        
        // Данные для подстановки
        Map<String, Object> data = new HashMap<>();
        data.put("Date", todayFormatted);
        data.put("DateFrom", dateFrom);
        data.put("DateTo", dateTo);
        data.put("Group", selectedGroup != null ? selectedGroup.getName() : "");
        data.put("Course", selectedGroup != null ? selectedGroup.getCourse() : "");
        TableRenderData table = new TableRenderData();
        table.setRows(rows);

        data.put("Table", table);
        
        // Открываем шаблон и подставляем значения
        Configure config = Configure.builder()
                .bind("Table", new TableRenderPolicy())
                .build();

        XWPFTemplate template = XWPFTemplate.compile(templateInputStream, config);

        template.render(data);
        
        // Создаем файл в папке Загрузки
        String downloadsPath = System.getProperty("user.home") + File.separator + "Downloads";
        String fileName = "Otchet_propuski_" + todayFormatted.replace(".", "_") + ".docx";
        String fullPath = downloadsPath + File.separator + fileName;
        
        // Убедимся, что папка существует
        Files.createDirectories(Paths.get(downloadsPath));
        
        // Сохраняем файл
        try(FileOutputStream fos = new FileOutputStream(fullPath)) {
            template.write(fos);
        }
        
        template.close();
        templateInputStream.close();
        
        return new File(fullPath);
    }
}
