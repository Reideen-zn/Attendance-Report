package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WordExportRequest {
    private String dateFrom;      // В формате dd.MM.yyyy
    private String dateTo;        // В формате dd.MM.yyyy
    private Long groupId;         // ID группы (может быть null если все группы)
}
