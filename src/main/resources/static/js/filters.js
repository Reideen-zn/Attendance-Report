// Фильтрация таблиц
async function filterTable(endpoint, filterValue) {
  const tableSelector = getTableSelector(endpoint);
  const table = document.querySelector(tableSelector);
  if(!table) return;
  
  const tbody = table.querySelector('tbody');
  
  if(!filterValue) {
    loadTableData(endpoint, tableSelector);
    return;
  }
  
  try {
    const data = await getAll(endpoint);
    
    let filtered = data;
    if(endpoint === '/students') {
      filtered = data.filter(item => item.group && item.group.id == filterValue);
    } else if(endpoint === '/classrooms') {
      filtered = data.filter(item => item.building && item.building.id == filterValue);
    }
    
    tbody.innerHTML = '';
    filtered.forEach(item => {
      const row = createTableRow(item, endpoint);
      tbody.appendChild(row);
    });
  } catch(error) {
    console.error('Ошибка при фильтрации:', error);
  }
}

async function loadSelectOptions(selectId, endpoint, selectedId = '') {
  try {
    const data = await getAll(endpoint);
    const select = document.getElementById(selectId);
    
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = endpoint === '/groups' ? item.name : (endpoint === '/buildings' ? item.name : item.name);
      if(item.id == selectedId) option.selected = true;
      select.appendChild(option);
    });
  } catch(error) {
    console.error('Ошибка при загрузке опций:', error);
  }
}

function reapplyFilter(endpoint) {
  if(endpoint === '/students') {
    const groupFilter = document.getElementById('groupFilter');
    if(groupFilter && groupFilter.value) {
      setTimeout(() => filterTable(endpoint, groupFilter.value), 100);
    }
  } else if(endpoint === '/classrooms') {
    const buildingFilter = document.getElementById('buildingFilter');
    if(buildingFilter && buildingFilter.value) {
      setTimeout(() => filterTable(endpoint, buildingFilter.value), 100);
    }
  }
}
