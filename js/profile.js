const ORDERS_PER_PAGE = 5;

let orders = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', loadOrders);

async function loadOrders() {
  orders = await apiGet('/orders');
  renderOrders();
  renderPagination();
}

function renderOrders() {
  const tbody = document.getElementById('ordersTable');
  tbody.innerHTML = '';

  const start =
    (currentPage - 1) * ORDERS_PER_PAGE;
  const pageOrders =
    orders.slice(start, start + ORDERS_PER_PAGE);

  pageOrders.forEach((order, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${start + index + 1}</td>
        <td>${order.course_id || 'Репетитор'}</td>
        <td>${order.date_start} ${order.time_start}</td>
        <td>${order.price} ₽</td>
        <td>
          <button
            class="btn btn-danger btn-sm"
            onclick="deleteOrder(${order.id})"
          >
            Удалить
          </button>
        </td>
      </tr>
    `;
  });
}

function renderPagination() {
  const pagination =
    document.getElementById('ordersPagination');
  pagination.innerHTML = '';

  const totalPages =
    Math.ceil(orders.length / ORDERS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <button class="page-link"
          onclick="goToPage(${i})">${i}</button>
      </li>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  renderOrders();
  renderPagination();
}

async function deleteOrder(id) {
  if (!confirm('Вы уверены, что хотите удалить заявку?')) {
    return;
  }

  await apiDelete(`/orders/${id}`);
  await loadOrders();
}
