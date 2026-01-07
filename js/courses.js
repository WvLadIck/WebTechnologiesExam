const COURSES_PER_PAGE = 5;

let allCourses = [];
let filteredCourses = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', initCourses);

/**
 * Инициализация
 */
async function initCourses() {
  try {
    allCourses = await apiGet('/courses');
    filteredCourses = [...allCourses];

    renderCourses();
    renderPagination();
    initSearch();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Поиск и фильтрация
 */
function initSearch() {
  document
    .getElementById('courseSearch')
    .addEventListener('input', filterCourses);

  document
    .getElementById('courseLevel')
    .addEventListener('change', filterCourses);
}

function filterCourses() {
  const searchValue =
    document.getElementById('courseSearch').value.toLowerCase();
  const levelValue =
    document.getElementById('courseLevel').value;

  filteredCourses = allCourses.filter(course => {
    const matchesName =
      course.name.toLowerCase().includes(searchValue);

    const matchesLevel =
      levelValue === '' || course.level === levelValue;

    return matchesName && matchesLevel;
  });

  currentPage = 1;
  renderCourses();
  renderPagination();
}

/**
 * Отрисовка таблицы
 */
function renderCourses() {
  const tableBody = document.getElementById('coursesTable');
  tableBody.innerHTML = '';

  const start =
    (currentPage - 1) * COURSES_PER_PAGE;
  const end =
    start + COURSES_PER_PAGE;

  const pageCourses =
    filteredCourses.slice(start, end);

  pageCourses.forEach(course => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td title="${course.description}">
        ${course.name}
      </td>
      <td>${course.level}</td>
      <td>${course.teacher}</td>
      <td>
        <button
          class="btn btn-success btn-sm"
          onclick='openOrderModal(${JSON.stringify(course)})'
        >
          Подать заявку
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * Пагинация
 */
function renderPagination() {
  const pagination = document.getElementById('coursesPagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(
    filteredCourses.length / COURSES_PER_PAGE
  );

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${
      i === currentPage ? 'active' : ''
    }`;

    li.innerHTML = `
      <button class="page-link">${i}</button>
    `;

    li.addEventListener('click', () => {
      currentPage = i;
      renderCourses();
      renderPagination();
    });

    pagination.appendChild(li);
  }
}
