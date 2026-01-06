// Инициализация страниц
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  let endpoint = null;
  let tableSelector = null;
  
  if(path.includes('/pages/groups.html')) {
    endpoint = '/groups';
    tableSelector = '#groupsTable';
  } else if(path.includes('/pages/students.html')) {
    endpoint = '/students';
    tableSelector = '#studentsTable';
    loadStudentFilters();
  } else if(path.includes('/pages/teachers.html')) {
    endpoint = '/teachers';
    tableSelector = '#teachersTable';
  } else if(path.includes('/pages/lesson-types.html')) {
    endpoint = '/lesson-types';
    tableSelector = '#lessonTypesTable';
  } else if(path.includes('/pages/buildings.html')) {
    endpoint = '/buildings';
    tableSelector = '#buildingsTable';
  } else if(path.includes('/pages/classrooms.html')) {
    endpoint = '/classrooms';
    tableSelector = '#classroomsTable';
    loadClassroomFilters();
  } else if(path.includes('/pages/disciplines.html')) {
    endpoint = '/disciplines';
    tableSelector = '#disciplinesTable';
  } else if(path.includes('/pages/lesson-times.html')) {
    endpoint = '/lesson-times';
    tableSelector = '#lessonTimesTable';
  }
  
  if(endpoint && tableSelector) {
    loadTableData(endpoint, tableSelector);
  }
});

async function loadStudentFilters() {
  try {
    const groups = await getAll('/groups');
    const select = document.getElementById('groupFilter');
    groups.forEach(group => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = group.name;
      select.appendChild(option);
    });
  } catch(error) {
    console.error('Ошибка при загрузке групп:', error);
  }
}

async function loadClassroomFilters() {
  try {
    const buildings = await getAll('/buildings');
    const select = document.getElementById('buildingFilter');
    buildings.forEach(building => {
      const option = document.createElement('option');
      option.value = building.id;
      option.textContent = building.name;
      select.appendChild(option);
    });
  } catch(error) {
    console.error('Ошибка при загрузке корпусов:', error);
  }
}
