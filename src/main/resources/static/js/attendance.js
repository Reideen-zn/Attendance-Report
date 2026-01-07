// Управление посещаемостью
let attendanceFilters = {
  building: null,
  classroom: null,
  discipline: null,
  lessonType: null,
  lessonTime: null,
  group: null
};

let attendanceData = {}; // {studentId: {present: true/false, ...}}

function showAttendanceFilters() {
  const filtersHTML = `
    <div class="attendance-filters">
      <div class="form-group">
        <label>Корпус</label>
        <select id="attendanceBuildingFilter" onchange="updateClassroomsForAttendance()">
          <option value="">Выберите корпус</option>
        </select>
      </div>
      <div class="form-group">
        <label>Аудитория</label>
        <select id="attendanceClassroomFilter">
          <option value="">Выберите аудиторию</option>
        </select>
      </div>
      <div class="form-group">
        <label>Дисциплина</label>
        <select id="attendanceDisciplineFilter">
          <option value="">Выберите дисциплину</option>
        </select>
      </div>
      <div class="form-group">
        <label>Тип занятия</label>
        <select id="attendanceLessonTypeFilter">
          <option value="">Выберите тип занятия</option>
        </select>
      </div>
      <div class="form-group">
        <label>Время</label>
        <select id="attendanceLessonTimeFilter">
          <option value="">Выберите время</option>
        </select>
      </div>
      <div class="form-group">
        <label>Группа</label>
        <select id="attendanceGroupFilter" onchange="showAttendanceTable()">
          <option value="">Выберите группу</option>
        </select>
      </div>
    </div>
  `;
  
  const filtersContainer = document.getElementById('attendanceFiltersContainer');
  if(filtersContainer) {
    filtersContainer.innerHTML = filtersHTML;
    loadAttendanceFilterOptions();
  }
}

async function loadAttendanceFilterOptions() {
  try {
    const buildings = await getAll('/buildings');
    const disciplines = await getAll('/disciplines');
    const lessonTypes = await getAll('/lesson-types');
    const lessonTimes = await getAll('/lesson-times');
    const groups = await getAll('/groups');
    
    populateSelect('attendanceBuildingFilter', buildings, 'name');
    populateSelect('attendanceDisciplineFilter', disciplines, 'name');
    populateSelect('attendanceLessonTypeFilter', lessonTypes, 'name');
    populateSelect('attendanceLessonTimeFilter', lessonTimes, 'time');
    populateSelect('attendanceGroupFilter', groups, 'name');
  } catch(error) {
    console.error('Ошибка при загрузке фильтров:', error);
  }
}

function populateSelect(selectId, items, displayField) {
  const select = document.getElementById(selectId);
  if(!select) return;
  
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item[displayField];
    select.appendChild(option);
  });
}

async function updateClassroomsForAttendance() {
  const buildingId = document.getElementById('attendanceBuildingFilter').value;
  const classroomSelect = document.getElementById('attendanceClassroomFilter');
  
  classroomSelect.innerHTML = '<option value="">Выберите аудиторию</option>';
  
  if(!buildingId) return;
  
  try {
    const classrooms = await getAll('/classrooms');
    const filtered = classrooms.filter(c => c.building && c.building.id == buildingId);
    
    filtered.forEach(classroom => {
      const option = document.createElement('option');
      option.value = classroom.id;
      option.textContent = classroom.number;
      classroomSelect.appendChild(option);
    });
  } catch(error) {
    console.error('Ошибка при загрузке аудиторий:', error);
  }
}

async function showAttendanceTable() {
  const building = document.getElementById('attendanceBuildingFilter').value;
  const classroom = document.getElementById('attendanceClassroomFilter').value;
  const discipline = document.getElementById('attendanceDisciplineFilter').value;
  const lessonType = document.getElementById('attendanceLessonTypeFilter').value;
  const lessonTime = document.getElementById('attendanceLessonTimeFilter').value;
  const group = document.getElementById('attendanceGroupFilter').value;
  
  if(!building || !classroom || !discipline || !lessonType || !lessonTime || !group) {
    alert('Заполните все поля');
    return;
  }
  
  // Сохраняем выбранные значения
  attendanceFilters = { building, classroom, discipline, lessonType, lessonTime, group };
  
  // Инициализируем данные посещаемости
  attendanceData = {};
  
  try {
    const students = await getAll('/students');
    const filtered = students.filter(s => s.group && s.group.id == group);
    
    const tableHTML = `
      <div class="attendance-table-container">
        <table class="attendance-matrix">
          <thead>
            <tr>
              <th>Студент</th>
              <th>Присутствие</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(student => {
              attendanceData[student.id] = { present: false };
              return `
                <tr>
                  <td>${student.lastName} ${student.firstName}</td>
                  <td>
                    <div class="attendance-cell present-false" id="cell-${student.id}" 
                         onclick="toggleAttendance(${student.id})"></div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div class="attendance-actions">
          <button class="btn btn-primary" onclick="saveAttendance()">Сохранить</button>
          <button class="btn btn-secondary" onclick="hideAttendanceTable()">Отмена</button>
        </div>
      </div>
    `;
    
    const tableContainer = document.getElementById('attendanceTableContainer');
    if(tableContainer) {
      tableContainer.innerHTML = tableHTML;
    }
  } catch(error) {
    console.error('Ошибка:', error);
    alert('Ошибка при загрузке студентов');
  }
}

function toggleAttendance(studentId) {
  if(!attendanceData[studentId]) {
    attendanceData[studentId] = { present: false };
  }
  
  attendanceData[studentId].present = !attendanceData[studentId].present;
  
  const cell = document.getElementById(`cell-${studentId}`);
  if(cell) {
    cell.className = `attendance-cell present-${attendanceData[studentId].present}`;
  }
}

async function saveAttendance() {
  try {
    const group = await getById('/groups', attendanceFilters.group);
    const classroom = await getById('/classrooms', attendanceFilters.classroom);
    const discipline = await getById('/disciplines', attendanceFilters.discipline);
    const lessonType = await getById('/lesson-types', attendanceFilters.lessonType);
    const building = await getById('/buildings', attendanceFilters.building);
    const lessonTime = await getById('/lesson-times', attendanceFilters.lessonTime);
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const attendanceDate = `${day}.${month}.${year}`;
    
    for(const studentId in attendanceData) {
      const student = await getById('/students', studentId);
      const present = attendanceData[studentId].present;
      const missedHours = !present ? 2 : 0;
      
      const record = {
        student: { id: studentId },
        group: { id: attendanceFilters.group },
        discipline: { id: attendanceFilters.discipline },
        lessonType: { id: attendanceFilters.lessonType },
        building: { id: attendanceFilters.building },
        classroom: { id: attendanceFilters.classroom },
        present: present,
        attendanceDate: attendanceDate,
        attendanceTime: { id: attendanceFilters.lessonTime },
        missedHours: missedHours
      };
      
      await create('/attendance', record);
    }
    
    alert('Посещаемость успешно сохранена');
    hideAttendanceTable();
  } catch(error) {
    console.error('Ошибка при сохранении:', error);
    alert('Ошибка при сохранении: ' + error.message);
  }
}

function hideAttendanceTable() {
  const tableContainer = document.getElementById('attendanceTableContainer');
  if(tableContainer) {
    tableContainer.innerHTML = '';
  }
}

// === ОТЧЕТ ===
let reportFilters = {
  dateFrom: null,
  dateTo: null,
  building: null,
  classroom: null,
  discipline: null,
  lessonType: null,
  lessonTime: null,
  group: null
};

function showReportDateRange() {
  const dateRangeHTML = `
    <div class="report-date-range">
      <div class="form-group">
        <label>Дата с</label>
        <input type="date" id="reportDateFrom">
      </div>
      <div class="form-group">
        <label>Дата по</label>
        <input type="date" id="reportDateTo">
      </div>
      <button class="btn btn-primary" onclick="showReportFilters()">Показать фильтры</button>
      <button class="btn btn-secondary" onclick="clearReportFilters()">Отмена</button>
    </div>
  `;
  
  const filtersContainer = document.getElementById('attendanceFiltersContainer');
  if(filtersContainer) {
    filtersContainer.innerHTML = dateRangeHTML;
  }
  
  document.getElementById('attendanceTableContainer').innerHTML = '';
}

function showReportFilters() {
  const dateFrom = document.getElementById('reportDateFrom').value;
  const dateTo = document.getElementById('reportDateTo').value;
  
  if(!dateFrom || !dateTo) {
    alert('Выберите диапазон дат');
    return;
  }
  
  reportFilters.dateFrom = dateFrom;
  reportFilters.dateTo = dateTo;
  
  const filtersHTML = `
    <div class="report-date-range">
      <div class="form-group">
        <label>Дата с</label>
        <input type="date" id="reportDateFrom" value="${dateFrom}" onchange="onReportDateChange()">
      </div>
      <div class="form-group">
        <label>Дата по</label>
        <input type="date" id="reportDateTo" value="${dateTo}" onchange="onReportDateChange()">
      </div>
    </div>
    <div class="attendance-filters">
      <div class="form-group">
        <label>Корпус</label>
        <select id="reportBuildingFilter" onchange="updateClassroomsForReport()">
          <option value="">Выберите корпус</option>
        </select>
      </div>
      <div class="form-group">
        <label>Аудитория</label>
        <select id="reportClassroomFilter" onchange="refreshReportTableIfReady()">
          <option value="">Выберите аудиторию</option>
        </select>
      </div>
      <div class="form-group">
        <label>Дисциплина</label>
        <select id="reportDisciplineFilter" onchange="refreshReportTableIfReady()">
          <option value="">Выберите дисциплину</option>
        </select>
      </div>
      <div class="form-group">
        <label>Тип занятия</label>
        <select id="reportLessonTypeFilter" onchange="refreshReportTableIfReady()">
          <option value="">Выберите тип занятия</option>
        </select>
      </div>
      <div class="form-group">
        <label>Время</label>
        <select id="reportLessonTimeFilter" onchange="refreshReportTableIfReady()">
          <option value="">Выберите время</option>
        </select>
      </div>
      <div class="form-group">
        <label>Группа</label>
        <select id="reportGroupFilter" onchange="refreshReportTableIfReady()">
          <option value="">Выберите группу</option>
        </select>
      </div>
    </div>
  `;
  
  const filtersContainer = document.getElementById('attendanceFiltersContainer');
  if(filtersContainer) {
    filtersContainer.innerHTML = filtersHTML;
    loadReportFilterOptions();
  }
}

async function loadReportFilterOptions() {
  try {
    const buildings = await getAll('/buildings');
    const disciplines = await getAll('/disciplines');
    const lessonTypes = await getAll('/lesson-types');
    const lessonTimes = await getAll('/lesson-times');
    const groups = await getAll('/groups');
    
    populateSelect('reportBuildingFilter', buildings, 'name');
    populateSelect('reportDisciplineFilter', disciplines, 'name');
    populateSelect('reportLessonTypeFilter', lessonTypes, 'name');
    populateSelect('reportLessonTimeFilter', lessonTimes, 'time');
    populateSelect('reportGroupFilter', groups, 'name');
  } catch(error) {
    console.error('Ошибка при загрузке фильтров:', error);
  }
}

async function updateClassroomsForReport() {
  const buildingId = document.getElementById('reportBuildingFilter').value;
  const classroomSelect = document.getElementById('reportClassroomFilter');
  
  classroomSelect.innerHTML = '<option value="">Выберите аудиторию</option>';
  
  if(!buildingId) return;
  
  try {
    const classrooms = await getAll('/classrooms');
    const filtered = classrooms.filter(c => c.building && c.building.id == buildingId);
    
    filtered.forEach(classroom => {
      const option = document.createElement('option');
      option.value = classroom.id;
      option.textContent = classroom.number;
      classroomSelect.appendChild(option);
    });
  } catch(error) {
    console.error('Ошибка при загрузке аудиторий:', error);
  }
}

function parseDate(dateStr) {
  // Преобразует "YYYY-MM-DD" в объект Date
  const [year, month, day] = dateStr.split('-');
  return new Date(year, month - 1, day);
}

function formatDateToDDMMYYYY(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function getDatesBetween(dateFromStr, dateToStr) {
  const dates = [];
  const dateFrom = parseDate(dateFromStr);
  const dateTo = parseDate(dateToStr);
  
  let current = new Date(dateFrom);
  while(current <= dateTo) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

async function showReportTable() {
  const building = document.getElementById('reportBuildingFilter').value;
  const classroom = document.getElementById('reportClassroomFilter').value;
  const discipline = document.getElementById('reportDisciplineFilter').value;
  const lessonType = document.getElementById('reportLessonTypeFilter').value;
  const lessonTime = document.getElementById('reportLessonTimeFilter').value;
  const group = document.getElementById('reportGroupFilter').value;
  
  if(!building || !classroom || !discipline || !lessonType || !lessonTime || !group) {
    alert('Заполните все поля');
    return;
  }
  
  try {
    // Получаем студентов группы
    const students = await getAll('/students');
    const filteredStudents = students.filter(s => s.group && s.group.id == group);
    
    // Получаем все записи посещаемости
    const allAttendance = await getAll('/attendance');
    
    // Получаем даты в диапазоне
    const dates = getDatesBetween(reportFilters.dateFrom, reportFilters.dateTo);
    
    // Строим матрицу данных
    const attendanceMap = {}; // {studentId: {dateString: {present: bool, ...}}}
    
    filteredStudents.forEach(student => {
      attendanceMap[student.id] = {};
      dates.forEach(date => {
        const dateStr = formatDateToDDMMYYYY(date);
        attendanceMap[student.id][dateStr] = { present: null }; // null = нет данных
      });
    });
    
    // Заполняем данные из БД
    allAttendance.forEach(record => {
      if(record.group.id == group && 
         record.discipline.id == discipline &&
         record.lessonType.id == lessonType &&
         record.attendanceTime.id == lessonTime &&
         record.building.id == building &&
         record.classroom.id == classroom) {
        
        if(attendanceMap[record.student.id] && attendanceMap[record.student.id][record.attendanceDate]) {
          attendanceMap[record.student.id][record.attendanceDate].present = record.present;
        }
      }
    });
    
    // Строим таблицу
    const tableHeaderCells = dates.map(date => {
      const dateStr = formatDateToDDMMYYYY(date);
      return `<th>${dateStr}</th>`;
    }).join('');
    
    const tableBodyRows = filteredStudents.map(student => {
      const dataCells = dates.map(date => {
        const dateStr = formatDateToDDMMYYYY(date);
        const status = attendanceMap[student.id][dateStr].present;
        let cellClass = 'attendance-report-cell';
        
        if(status === null) {
          cellClass += ' no-data';
        } else if(status === true) {
          cellClass += ' present-true';
        } else {
          cellClass += ' present-false';
        }
        
        return `<td><div class="${cellClass}"></div></td>`;
      }).join('');
      
      return `
        <tr>
          <td class="student-name">${student.lastName} ${student.firstName}</td>
          ${dataCells}
        </tr>
      `;
    }).join('');
    
    const tableHTML = `
      <div class="report-table-container">
        <table class="report-matrix">
          <thead>
            <tr>
              <th>Студент</th>
              ${tableHeaderCells}
            </tr>
          </thead>
          <tbody>
            ${tableBodyRows}
          </tbody>
        </table>
        <div class="attendance-actions">
          <button class="btn btn-secondary" onclick="clearReportFilters()">Закрыть</button>
        </div>
      </div>
    `;
    
    const tableContainer = document.getElementById('attendanceTableContainer');
    if(tableContainer) {
      tableContainer.innerHTML = tableHTML;
    }
  } catch(error) {
    console.error('Ошибка:', error);
    alert('Ошибка при загрузке отчета: ' + error.message);
  }
}

function clearReportFilters() {
  document.getElementById('attendanceFiltersContainer').innerHTML = '';
  document.getElementById('attendanceTableContainer').innerHTML = '';
}

function onReportDateChange() {
  const dateFrom = document.getElementById('reportDateFrom').value;
  const dateTo = document.getElementById('reportDateTo').value;
  
  if(dateFrom && dateTo) {
    reportFilters.dateFrom = dateFrom;
    reportFilters.dateTo = dateTo;
    refreshReportTableIfReady();
  }
}

function refreshReportTableIfReady() {
  const building = document.getElementById('reportBuildingFilter')?.value;
  const classroom = document.getElementById('reportClassroomFilter')?.value;
  const discipline = document.getElementById('reportDisciplineFilter')?.value;
  const lessonType = document.getElementById('reportLessonTypeFilter')?.value;
  const lessonTime = document.getElementById('reportLessonTimeFilter')?.value;
  const group = document.getElementById('reportGroupFilter')?.value;
  
  if(building && classroom && discipline && lessonType && lessonTime && group) {
    showReportTable();
  }
}

// === ОТЧЕТ ПО ПРОПУСКАМ ===
function showReportMissesDateRange() {
  const dateRangeHTML = `
    <div class="report-date-range">
      <div class="form-group">
        <label>Дата с</label>
        <input type="date" id="reportMissesDateFrom" onchange="refreshReportMissesIfReady()">
      </div>
      <div class="form-group">
        <label>Дата по</label>
        <input type="date" id="reportMissesDateTo" onchange="refreshReportMissesIfReady()">
      </div>
      <div class="form-group">
        <label>Группа (необязательно)</label>
        <select id="reportMissesGroupFilter" onchange="refreshReportMissesIfReady()">
          <option value="">Все группы</option>
        </select>
      </div>
      <button class="btn btn-secondary" onclick="clearReportFilters()">Отмена</button>
      <button class="btn btn-primary" id="exportWordBtn" style="display: none;" onclick="exportMissesReportToWord()">Экспортировать в Word</button>
    </div>
  `;
  
  const filtersContainer = document.getElementById('attendanceFiltersContainer');
  if(filtersContainer) {
    filtersContainer.innerHTML = dateRangeHTML;
    loadReportMissesFilterOptions();
  }
  
  document.getElementById('attendanceTableContainer').innerHTML = '';
}

async function loadReportMissesFilterOptions() {
  try {
    const groups = await getAll('/groups');
    populateSelect('reportMissesGroupFilter', groups, 'name');
  } catch(error) {
    console.error('Ошибка при загрузке групп:', error);
  }
}

async function showReportMissesTable() {
  const dateFromStr = document.getElementById('reportMissesDateFrom').value;
  const dateToStr = document.getElementById('reportMissesDateTo').value;
  const selectedGroupId = document.getElementById('reportMissesGroupFilter').value;
  
  if(!dateFromStr || !dateToStr) {
    alert('Выберите диапазон дат');
    return;
  }
  
  try {
    const allAttendance = await getAll('/attendance');
    let students = await getAll('/students');
    
    // Фильтруем студентов по группе если выбрана
    if(selectedGroupId) {
      students = students.filter(s => s.group && s.group.id == selectedGroupId);
    }
    
    // Фильтруем записи по датам и наличию пропусков
    const dateFrom = parseDate(dateFromStr);
    const dateTo = parseDate(dateToStr);
    
    const missedRecords = {};
    
    allAttendance.forEach(record => {
      if(!record.present) { // Только пропуски (present = false)
        const recordDate = parseDateFromString(record.attendanceDate);
        
        if(recordDate >= dateFrom && recordDate <= dateTo) {
          if(!missedRecords[record.student.id]) {
            missedRecords[record.student.id] = [];
          }
          missedRecords[record.student.id].push(record);
        }
      }
    });
    
    // Генерируем таблицу
    let tableBodyRows = '';
    
    students.forEach(student => {
      if(missedRecords[student.id] && missedRecords[student.id].length > 0) {
        const studentMisses = missedRecords[student.id];
        let totalMissedHours = 0;
        
        // Строки с пропусками студента
        studentMisses.forEach((record, index) => {
          totalMissedHours += record.missedHours || 0;
          
          const lessonInfo = `${record.lessonType.name}, ${record.classroom.number}, ${record.building.name}`;
          
          // ФИО и группа только в первой строке
          const nameCell = index === 0 ? `<td>${student.lastName} ${student.firstName}</td>` : '<td></td>';
          const groupCell = index === 0 ? `<td>${student.group.name}</td>` : '<td></td>';
          
          tableBodyRows += `
            <tr>
              ${nameCell}
              ${groupCell}
              <td>${record.discipline.name}</td>
              <td>${lessonInfo}</td>
              <td>${record.attendanceDate}</td>
              <td>${record.attendanceTime.time}</td>
              <td>${record.missedHours}</td>
            </tr>
          `;
        });
        
        // Строка итога для студента
        tableBodyRows += `
          <tr class="student-total">
            <td colspan="6" style="text-align: right; font-weight: 600;">Всего:</td>
            <td style="font-weight: 600;">${totalMissedHours}</td>
          </tr>
        `;
      }
    });
    
    if(!tableBodyRows) {
      const tableContainer = document.getElementById('attendanceTableContainer');
      if(tableContainer) {
        tableContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Пропусков не найдено</p>';
      }
      return;
    }
    
    const tableHTML = `
      <div class="report-table-container">
        <table class="misses-report-table">
          <thead>
            <tr>
              <th>ФИО студента</th>
              <th>№ группы</th>
              <th>Дисциплина</th>
              <th>Вид занятия, аудитория, корпус</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Кол-во пропущенных часов</th>
            </tr>
          </thead>
          <tbody>
            ${tableBodyRows}
          </tbody>
        </table>
        <div class="attendance-actions">
          <button class="btn btn-secondary" onclick="clearReportFilters()">Закрыть</button>
        </div>
      </div>
    `;
    
    const tableContainer = document.getElementById('attendanceTableContainer');
    if(tableContainer) {
      tableContainer.innerHTML = tableHTML;
    }
    
    // Показываем кнопку экспорта
    const exportBtn = document.getElementById('exportWordBtn');
    if(exportBtn) {
      exportBtn.style.display = 'block';
    }
  } catch(error) {
    console.error('Ошибка:', error);
    alert('Ошибка при загрузке отчета: ' + error.message);
  }
}

function parseDateFromString(dateStr) {
  // Преобразует "dd.MM.yyyy" в объект Date
  const [day, month, year] = dateStr.split('.');
  return new Date(year, month - 1, day);
}

function refreshReportMissesIfReady() {
  const dateFrom = document.getElementById('reportMissesDateFrom')?.value;
  const dateTo = document.getElementById('reportMissesDateTo')?.value;
  
  if(dateFrom && dateTo) {
    showReportMissesTable();
  }
}

async function exportMissesReportToWord() {
  const dateFromInput = document.getElementById('reportMissesDateFrom').value;
  const dateToInput = document.getElementById('reportMissesDateTo').value;
  const groupSelect = document.getElementById('reportMissesGroupFilter');
  const groupId = groupSelect.value ? parseInt(groupSelect.value) : null;
  
  // Преобразуем даты из формата yyyy-MM-dd в dd.MM.yyyy
  const [yearFrom, monthFrom, dayFrom] = dateFromInput.split('-');
  const dateFrom = `${dayFrom}.${monthFrom}.${yearFrom}`;
  
  const [yearTo, monthTo, dayTo] = dateToInput.split('-');
  const dateTo = `${dayTo}.${monthTo}.${yearTo}`;
  
  try {
    const response = await fetch('/api/v1/attendance/export-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateFrom: dateFrom,
        dateTo: dateTo,
        groupId: groupId
      })
    });
    
    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    
    // Получаем blob и скачиваем файл
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Otchet_propuski_${dateFrom.replace(/\./g, '_')}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch(error) {
    console.error('Ошибка при экспорте в Word:', error);
    alert('Ошибка при экспорте в Word: ' + error.message);
  }
}


