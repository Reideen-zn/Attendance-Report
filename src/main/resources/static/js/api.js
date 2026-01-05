// API запросы
async function apiCall(method, endpoint, data = null) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if(data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(`/api/v1${endpoint}`, options);
  
  if(!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  // Для DELETE возвращаем только статус
  if(response.status === 204) {
    return null;
  }
  
  return await response.json();
}

async function getAll(endpoint) {
  return apiCall('GET', endpoint);
}

async function getById(endpoint, id) {
  return apiCall('GET', `${endpoint}/${id}`);
}

async function create(endpoint, data) {
  return apiCall('POST', endpoint, data);
}

async function update(endpoint, id, data) {
  return apiCall('PUT', `${endpoint}/${id}`, data);
}

async function delete_(endpoint, id) {
  return apiCall('DELETE', `${endpoint}/${id}`);
}
