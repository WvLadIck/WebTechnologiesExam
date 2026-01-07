const API_KEY = '71950085-e236-4db2-b3e7-35495a8c084c';
const API_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru/api';

/**
 * GET-запрос
 */
async function apiGet(endpoint) {
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Ошибка загрузки данных');
  }

  return response.json();
}
