let supplies = JSON.parse(localStorage.getItem('hbSupplies')) || [];

function saveToLocalStorage() {
  localStorage.setItem('hbSupplies', JSON.stringify(supplies));
}

function renderTable(filteredSupplies = supplies) {
  const tbody = document.querySelector('#itemsTable tbody');
  tbody.innerHTML = '';

  let total = 0;

  filteredSupplies.forEach((item, index) => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;

    const row = document.createElement('tr');
    if (item.quantity < 5) row.classList.add('low-stock');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td>
        <button onclick="changeQuantity(${index}, 1)" class="btn btn-sm btn-success">+</button>
        <button onclick="changeQuantity(${index}, -1)" class="btn btn-sm btn-warning">-</button>
        <button onclick="deleteItem(${index})" class="btn btn-sm btn-danger">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('totalValue').innerHTML = `
    <strong>Total Inventory Value: $${total.toFixed(2)}</strong>
  `;
}

function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const qty = parseInt(document.getElementById('itemQty').value) || 0;
  const price = parseFloat(document.getElementById('itemPrice').value) || 0;

  if (!name || qty <= 0 || price <= 0) {
    alert("Please fill all fields correctly!");
    return;
  }

  supplies.push({ name, quantity: qty, price });
  saveToLocalStorage();
  renderTable();

  // Clear inputs
  document.getElementById('itemName').value = '';
  document.getElementById('itemQty').value = '1';
  document.getElementById('itemPrice').value = '';
}

function changeQuantity(index, change) {
  supplies[index].quantity += change;
  if (supplies[index].quantity <= 0) {
    supplies.splice(index, 1);
  }
  saveToLocalStorage();
  renderTable();
}

function deleteItem(index) {
  if (confirm("Delete this item?")) {
    supplies.splice(index, 1);
    saveToLocalStorage();
    renderTable();
  }
}

function filterItems() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filtered = supplies.filter(item => 
    item.name.toLowerCase().includes(searchTerm)
  );
  renderTable(filtered);
}

// Initial render
renderTable();
