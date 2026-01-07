let selectedCourse = null;

/**
 * Открытие формы заявки
 * вызывается при нажатии "Подать заявку"
 */
function openOrderModal(course) {
  selectedCourse = course;

  document.getElementById('selectedCourseId').value = course.id;
  document.getElementById('courseName').value = course.name;
  document.getElementById('teacherName').value = course.teacher;

  fillDates(course.start_dates);

  new bootstrap.Modal('#orderModal').show();
}

/**
 * Заполнение дат
 */
function fillDates(dates) {
  const dateSelect = document.getElementById('dateStart');
  const timeSelect = document.getElementById('timeStart');

  dateSelect.innerHTML = '<option value="">Выберите дату</option>';
  timeSelect.innerHTML = '';
  timeSelect.disabled = true;

  const grouped = {};

  dates.forEach(dt => {
    const [date, time] = dt.split('T');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(time.slice(0, 5));
  });

  Object.keys(grouped).forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    dateSelect.appendChild(option);
  });

  dateSelect.onchange = () => {
    const times = grouped[dateSelect.value];
    timeSelect.innerHTML = '<option value="">Выберите время</option>';
    timeSelect.disabled = false;

    times.forEach(time => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });

    calculatePrice();
  };
}

/**
 * Расчёт стоимости
 */
function calculatePrice() {
  if (!selectedCourse) return;

  const persons =
    Number(document.getElementById('persons').value);

  const time =
    document.getElementById('timeStart').value;

  let base =
    selectedCourse.course_fee_per_hour *
    selectedCourse.week_length *
    selectedCourse.total_length;

  let multiplier = 1;

  // Утро
  if (time >= '09:00' && time <= '12:00') {
    base += 400;
  }

  // Вечер
  if (time >= '18:00' && time <= '20:00') {
    base += 1000;
  }

  // Выходные
  const date =
    new Date(document.getElementById('dateStart').value);
  if (date.getDay() === 0 || date.getDay() === 6) {
    multiplier = 1.5;
  }

  let price = base * multiplier * persons;

  // Автоматические скидки
  if (persons >= 5) {
    price *= 0.85;
  }

  // Дополнительные опции
  if (supplementary.checked) {
    price += 2000 * persons;
  }

  if (personalized.checked) {
    price += 1500 * selectedCourse.total_length;
  }

  if (excursions.checked) {
    price *= 1.25;
  }

  if (assessment.checked) {
    price += 300;
  }

  if (interactive.checked) {
    price *= 1.5;
  }

  document.getElementById('totalPrice').textContent =
    Math.round(price);
}

/**
 * События пересчёта
 */
document.querySelectorAll('.option').forEach(option => {
  option.addEventListener('change', calculatePrice);
});

document.getElementById('persons')
  .addEventListener('input', calculatePrice);

document.getElementById('timeStart')
  .addEventListener('change', calculatePrice);
