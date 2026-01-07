const API_KEY = '71950085-e236-4db2-b3e7-35495a8c084c';
const API_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru/api';

/**
 * GET-запрос
 */
async function apiGet(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}`);
  if (!response.ok) throw new Error('Ошибка загрузки данных');
  return response.json();
}

/**
 * POST-запрос
 */
async function apiPost(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Ошибка отправки данных');
  return response.json();
}

/**
 * PUT-запрос
 */
async function apiPut(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Ошибка обновления данных');
  return response.json();
}

/**
 * DELETE-запрос
 */
async function apiDelete(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Ошибка удаления данных');
  return response.json();
}

/**
 * Показ уведомления
 */
function showAlert(message, type) {
  const alerts = document.getElementById('alerts');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = 'alert';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  alerts.appendChild(alert);

  setTimeout(() => {
    alert.classList.remove('show');
    alert.remove();
  }, 5000);
}
