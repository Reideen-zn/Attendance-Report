// Загрузка и отображение таблиц
let currentEndpoint = null;

async function loadTableData(endpoint, tableSelector) {
  currentEndpoint = endpoint;
  const table = document.querySelector(tableSelector);
  if(!table) return;
  
  const tbody = table.querySelector('tbody');
  if(!tbody) return;
  
  tbody.innerHTML = '<tr><td colspan="10" class="loading">Загрузка данных...</td></tr>';
  
  try {
    const data = await getAll(endpoint);
    
    if(data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px;">Нет данных</td></tr>';
      return;
    }
    
    tbody.innerHTML = '';
    data.forEach(item => {
      const row = createTableRow(item, endpoint);
      tbody.appendChild(row);
    });
  } catch(error) {
    console.error('Ошибка при загрузке данных:', error);
    tbody.innerHTML = `<tr><td colspan="10" class="error">Ошибка загрузки данных: ${error.message}</td></tr>`;
  }
}

function createTableRow(item, endpoint) {
  const row = document.createElement('tr');
  
  if(endpoint === '/groups') {
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>
        <div class="action-icons">
          <button class="icon-btn" onclick="openEditModal('/groups', ${item.id})">✏️</button>
          <button class="icon-btn" onclick="deleteItemConfirm('/groups', ${item.id})">🗑️</button>
        </div>
      </td>
    `;
  } else if(endpoint === '/students') {
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.lastName}</td>
      <td>${item.firstName}</td>
      <td>${item.group ? item.group.name : 'N/A'}</td>
      <td>
        <div class="action-icons">
          <button class="icon-btn" onclick="openEditModal('/students', ${item.id})">✏️</button>
          <button class="icon-btn" onclick="deleteItemConfirm('/students', ${item.id})">🗑️</button>
        </div>
      </td>
    `;
  } else if(endpoint === '/teachers') {
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.fullName}</td>
      <td>
        <div class="action-icons">
          <button class="icon-btn" onclick="openEditModal('/teachers', ${item.id})">✏️</button>
          <button class="icon-btn" onclick="deleteItemConfirm('/teachers', ${item.id})">🗑️</button>
        </div>
      </td>
    `;
  } else if(endpoint === '/lesson-types') {
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>
        <div class="action-icons">
          <button class="icon-btn" onclick="openEditModal('/lesson-types', ${item.id})">✏️</button>
          <button class="icon-btn" onclick="deleteItemConfirm('/lesson-types', ${item.id})">🗑️</button>
        </div>
      </td>
    `;
  } else if(endpoint === '/buildings') {
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>
        <div class="action-icons">
          <button class="icon-btn" onclick="openEditModal('/buildings', ${item.id})">✏️</button>
          <button class="icon-btn" onclick="deleteItemConfirm('/buildings', ${item.id})">🗑️</button>
        </div>
      </td>
    `;
  } else if(endpoint === '/classrooms') {
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.number}</td>
      <td>${item.building ? item.building.name : 'N/A'}</td>
      <td>
        <div class="action-icons">
          <button class="icon-btn" onclick="openEditModal('/classrooms', ${item.id})">✏️</button>
          <button class="icon-btn" onclick="deleteItemConfirm('/classrooms', ${item.id})">🗑️</button>
        </div>
      </td>
    `;
  } else if(endpoint === '/disciplines') {
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>
        <div class="action-icons">
          <button class="icon-btn" onclick="openEditModal('/disciplines', ${item.id})">✏️</button>
          <button class="icon-btn" onclick="deleteItemConfirm('/disciplines', ${item.id})">🗑️</button>
        </div>
      </td>
    `;
  }
  
  return row;
}

function getTableSelector(endpoint) {
  const map = {
    '/groups': '#groupsTable',
    '/students': '#studentsTable',
    '/teachers': '#teachersTable',
    '/lesson-types': '#lessonTypesTable',
    '/buildings': '#buildingsTable',
    '/classrooms': '#classroomsTable',
    '/disciplines': '#disciplinesTable'
  };
  return map[endpoint] || '';
}
