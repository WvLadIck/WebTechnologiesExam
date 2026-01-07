const ORDERS_PER_PAGE = 5;

let orders = [];
let courses = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  await loadCourses();  // Для отображения названия курса
  await loadOrders();
});

// Загрузка курсов для отображения имени вместо ID
async function loadCourses() {
  courses = await apiGet('/courses');
}

// Загрузка заявок
async function loadOrders() {
  orders = await apiGet('/orders');
  renderOrders();
  renderPagination();
}

// Получить название курса по course_id
function getCourseName(courseId) {
  const course = courses.find(c => c.id === courseId);
  return course ? course.name : 'Репетитор';
}

// Отрисовка таблицы
function renderOrders() {
  const tbody = document.getElementById('ordersTable');
  tbody.innerHTML = '';

  const start = (currentPage - 1) * ORDERS_PER_PAGE;
  const pageOrders = orders.slice(start, start + ORDERS_PER_PAGE);

  pageOrders.forEach((order, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${start + index + 1}</td>
        <td>${getCourseName(order.course_id)}</td>
        <td>${order.date_start} ${order.time_start}</td>
        <td>${order.price} ₽</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="showOrderDetails(${order.id})">Подробнее</button>
          <button class="btn btn-warning btn-sm" onclick="editOrder(${order.id})">Изменить</button>
          <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})">Удалить</button>
        </td>
      </tr>
    `;
  });
}

// Пагинация
function renderPagination() {
  const pagination = document.getElementById('ordersPagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <button class="page-link" onclick="goToPage(${i})">${i}</button>
      </li>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  renderOrders();
  renderPagination();
}

// Удаление заявки
async function deleteOrder(id) {
  if (!confirm('Вы уверены, что хотите удалить заявку?')) return;
  await apiDelete(`/orders/${id}`);
  await loadOrders();
}

// Показ деталей заявки
function showOrderDetails(orderId) {
  const order = orders.find(o => o.id === orderId);
  alert(`
    Курс: ${getCourseName(order.course_id)}
    Дата: ${order.date_start} ${order.time_start}
    Продолжительность: ${order.duration} часов
    Студенты: ${order.persons}
    Стоимость: ${order.price} ₽
    Опции: ${[
      order.early_registration ? 'Ранняя регистрация' : null,
      order.group_enrollment ? 'Групповая запись' : null,
      order.intensive_course ? 'Интенсив' : null,
      order.supplementary ? 'Доп. материалы' : null,
      order.personalized ? 'Индивидуальные' : null,
      order.excursions ? 'Экскурсии' : null,
      order.assessment ? 'Оценка' : null,
      order.interactive ? 'Интерактив' : null
    ].filter(Boolean).join(', ')}
  `);
}

// Редактирование заявки
async function editOrder(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const newDate = prompt('Введите новую дату (YYYY-MM-DD):', order.date_start);
  const newTime = prompt('Введите новое время (HH:MM):', order.time_start);

  if (newDate && newTime) {
    // Рассчёт скидки за раннюю регистрацию (example)
    const today = new Date();
    const dateStart = new Date(newDate);
    const earlyRegistration = (dateStart - today) / (1000 * 60 * 60 * 24) >= 30;

    const updatedOrder = {
      ...order,
      date_start: newDate,
      time_start: newTime,
      early_registration: earlyRegistration
    };

    try {
      await apiPut(`/orders/${orderId}`, updatedOrder);
      showAlert('Заявка успешно обновлена', 'success');
      await loadOrders();
    } catch (error) {
      console.error(error);
      showAlert('Ошибка при обновлении заявки', 'danger');
    }
  }
}
