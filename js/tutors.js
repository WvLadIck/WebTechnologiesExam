let allTutors = [];
let filteredTutors = [];
let selectedTutorId = null;

document.addEventListener('DOMContentLoaded', initTutors);

async function initTutors() {
  try {
    allTutors = await apiGet('/tutors');
    filteredTutors = [...allTutors];

    renderTutors();
    initTutorSearch();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Инициализация поиска
 */
function initTutorSearch() {
  document
    .getElementById('tutorLanguage')
    .addEventListener('change', filterTutors);

  document
    .getElementById('tutorLevel')
    .addEventListener('change', filterTutors);

  document
    .getElementById('tutorExperience')
    .addEventListener('input', filterTutors);
}

/**
 * Фильтрация репетиторов
 */
function filterTutors() {
  const language =
    document.getElementById('tutorLanguage').value;
  const level =
    document.getElementById('tutorLevel').value;
  const experience =
    document.getElementById('tutorExperience').value;

  filteredTutors = allTutors.filter(tutor => {
    const matchesLanguage =
      !language || tutor.languages_offered.includes(language);

    const matchesLevel =
      !level || tutor.language_level === level;

    const matchesExperience =
      !experience || tutor.work_experience >= Number(experience);

    return matchesLanguage && matchesLevel && matchesExperience;
  });

  renderTutors();
}

/**
 * Отрисовка таблицы репетиторов
 */
function renderTutors() {
  const tbody = document.getElementById('tutorsTable');
  tbody.innerHTML = '';

  filteredTutors.forEach(tutor => {
    const row = document.createElement('tr');
    row.dataset.tutorId = tutor.id;

    // 🔹 Подсветка выбранного репетитора
    if (tutor.id === selectedTutorId) {
      row.classList.add('tutor-selected');
    }

    row.innerHTML = `
      <td>
        <img
          src="https://img.icons8.com/?size=100&id=J5Rh923VgFPM&format=png&color=000000"
          alt="Фото"
          width="40"
          height="40"
        >
      </td>
      <td>${tutor.name}</td>
      <td>${tutor.language_level}</td>
      <td>${tutor.languages_spoken.join(', ')}</td>
      <td>${tutor.work_experience} лет</td>
      <td>${tutor.price_per_hour} ₽/час</td>
      <td>
        <button class="btn btn-primary btn-sm">
          Выбрать
        </button>
      </td>
    `;

    // 🔹 Кнопка выбора репетитора
    row.querySelector('button').addEventListener('click', () => {
      selectTutor(tutor.id);
    });

    tbody.appendChild(row);
  });
}

/**
 * Выбор репетитора
 */
function selectTutor(tutorId) {
  selectedTutorId = tutorId;

  // 🔹 Убираем подсветку со всех строк
  document
    .querySelectorAll('#tutorsTable tr')
    .forEach(row => row.classList.remove('tutor-selected'));

  // 🔹 Добавляем подсветку выбранной строке
  const selectedRow = document.querySelector(
    `#tutorsTable tr[data-tutor-id="${tutorId}"]`
  );

  if (selectedRow) {
    selectedRow.classList.add('tutor-selected');
  }
}
