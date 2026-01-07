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
      !language ||
      tutor.languages_offered.includes(language);

    const matchesLevel =
      !level || tutor.language_level === level;

    const matchesExperience =
      !experience ||
      tutor.work_experience >= Number(experience);

    return (
      matchesLanguage &&
      matchesLevel &&
      matchesExperience
    );
  });

  renderTutors();
}

/**
 * Отрисовка таблицы
 */
function renderTutors() {
  const tbody = document.getElementById('tutorsTable');
  tbody.innerHTML = '';

  filteredTutors.forEach(tutor => {
    const row = document.createElement('tr');

    if (tutor.id === selectedTutorId) {
      row.classList.add('tutor-selected');
    }

    row.innerHTML = `
      <td>
        <img
          src="assets/tutor-placeholder.png"
          alt="Фото"
          width="50"
          height="50"
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
  renderTutors();
}
