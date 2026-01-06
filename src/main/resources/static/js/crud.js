// CRUD операции
let currentEditId = null;

function buildFormHTML(endpoint, item = null) {
  if(endpoint === '/groups') {
    return `
      <div class="form-group">
        <label>Название группы</label>
        <input type="text" id="name" placeholder="Введите название" value="${item?.name || ''}">
      </div>
    `;
  } else if(endpoint === '/students') {
    const groupId = item?.group?.id || '';
    return `
      <div class="form-group">
        <label>Фамилия</label>
        <input type="text" id="lastName" placeholder="Введите фамилию" value="${item?.lastName || ''}">
      </div>
      <div class="form-group">
        <label>Имя</label>
        <input type="text" id="firstName" placeholder="Введите имя" value="${item?.firstName || ''}">
      </div>
      <div class="form-group">
        <label>Группа</label>
        <select id="groupId">
          <option value="">Выберите группу</option>
        </select>
      </div>
    `;
  } else if(endpoint === '/teachers') {
    return `
      <div class="form-group">
        <label>ФИО</label>
        <input type="text" id="fullName" placeholder="Введите ФИО" value="${item?.fullName || ''}">
      </div>
    `;
  } else if(endpoint === '/lesson-types') {
    return `
      <div class="form-group">
        <label>Тип занятия</label>
        <input type="text" id="name" placeholder="Введите тип занятия" value="${item?.name || ''}">
      </div>
    `;
  } else if(endpoint === '/buildings') {
    return `
      <div class="form-group">
        <label>Название корпуса</label>
        <input type="text" id="name" placeholder="Введите название" value="${item?.name || ''}">
      </div>
    `;
  } else if(endpoint === '/classrooms') {
    const buildingId = item?.building?.id || '';
    return `
      <div class="form-group">
        <label>Номер аудитории</label>
        <input type="text" id="number" placeholder="Введите номер" value="${item?.number || ''}">
      </div>
      <div class="form-group">
        <label>Корпус</label>
        <select id="buildingId">
          <option value="">Выберите корпус</option>
        </select>
      </div>
    `;
  } else if(endpoint === '/disciplines') {
    return `
      <div class="form-group">
        <label>Название дисциплины</label>
        <input type="text" id="name" placeholder="Введите название" value="${item?.name || ''}">
      </div>
    `;
  } else if(endpoint === '/lesson-times') {
    return `
      <div class="form-group">
        <label>Время занятия</label>
        <input type="text" id="time" placeholder="Введите время (например, 11:40-13:15)" value="${item?.time || ''}">
      </div>
    `;
  }
  return '';
}

function buildItemData(endpoint) {
  let data = {};
  
  if(endpoint === '/groups') {
    data = { name: document.getElementById('name').value };
  } else if(endpoint === '/students') {
    data = {
      lastName: document.getElementById('lastName').value,
      firstName: document.getElementById('firstName').value,
      group: { id: parseInt(document.getElementById('groupId').value) }
    };
  } else if(endpoint === '/teachers') {
    data = { fullName: document.getElementById('fullName').value };
  } else if(endpoint === '/lesson-types') {
    data = { name: document.getElementById('name').value };
  } else if(endpoint === '/buildings') {
    data = { name: document.getElementById('name').value };
  } else if(endpoint === '/classrooms') {
    data = {
      number: document.getElementById('number').value,
      building: { id: parseInt(document.getElementById('buildingId').value) }
    };
  } else if(endpoint === '/disciplines') {
    data = { name: document.getElementById('name').value };
  } else if(endpoint === '/lesson-times') {
    data = { time: document.getElementById('time').value };
  }
  
  return data;
}

async function openAddModal(endpoint) {
  currentEditId = null;
  setModalTitle('Добавить новую запись');
  
  const formHTML = buildFormHTML(endpoint);
  setModalForm(formHTML);
  
  if(endpoint === '/students') {
    const groupFilter = document.getElementById('groupFilter');
    const groupId = groupFilter ? groupFilter.value : '';
    await loadSelectOptions('groupId', '/groups', groupId);
  } else if(endpoint === '/classrooms') {
    const buildingFilter = document.getElementById('buildingFilter');
    const buildingId = buildingFilter ? buildingFilter.value : '';
    await loadSelectOptions('buildingId', '/buildings', buildingId);
  }
  
  openModal();
}

async function openEditModal(endpoint, id) {
  currentEditId = id;
  setModalTitle('Редактировать запись');
  
  try {
    const item = await getById(endpoint, id);
    
    const formHTML = buildFormHTML(endpoint, item);
    setModalForm(formHTML);
    
    if(endpoint === '/students') {
      await loadSelectOptions('groupId', '/groups', item.group.id);
    } else if(endpoint === '/classrooms') {
      await loadSelectOptions('buildingId', '/buildings', item.building.id);
    }
    
    openModal();
  } catch(error) {
    console.error('Ошибка:', error);
    alert('Ошибка при загрузке данных');
  }
}

async function saveItem() {
  const endpoint = currentEndpoint;
  const data = buildItemData(endpoint);
  
  try {
    if(currentEditId) {
      await update(endpoint, currentEditId, data);
    } else {
      await create(endpoint, data);
    }
    
    closeModal();
    
    const tableSelector = getTableSelector(endpoint);
    loadTableData(endpoint, tableSelector);
    reapplyFilter(endpoint);
  } catch(error) {
    console.error('Ошибка:', error);
    alert('Ошибка при сохранении: ' + error.message);
  }
}

async function deleteItemConfirm(endpoint, id) {
  if(!confirm('Вы уверены?')) return;
  
  try {
    await delete_(endpoint, id);
    
    const tableSelector = getTableSelector(endpoint);
    loadTableData(endpoint, tableSelector);
    reapplyFilter(endpoint);
  } catch(error) {
    console.error('Ошибка:', error);
    alert('Ошибка при удалении: ' + error.message);
  }
}
