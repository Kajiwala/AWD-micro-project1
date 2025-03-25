// DOM Elements
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const addBtn = document.getElementById("add-btn");
const expenseList = document.getElementById("expense-list");

// Initialize expenses array from localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Add Expense
addBtn.addEventListener("click", () => {
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);
  const category = expenseCategory.value;

  if (name && !isNaN(amount) && amount > 0) {
    const newExpense = { name, amount, category };
    expenses.push(newExpense);
    saveToLocalStorage();
    renderExpenses();
    renderChart();
    expenseName.value = "";
    expenseAmount.value = "";
  } else {
    alert("Please enter valid details!");
  }
});

// Delete Expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveToLocalStorage();
  renderExpenses();
  renderChart();
}

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Render Expenses Table
function renderExpenses() {
  expenseList.innerHTML = expenses
    .map(
      (expense, index) => `
      <tr>
        <td>${expense.name}</td>
        <td>$${expense.amount.toFixed(2)}</td>
        <td>${expense.category}</td>
        <td>
          <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
        </td>
      </tr>
    `
    )
    .join("");
}

// Render Chart (using Chart.js)
function renderChart() {
  const ctx = document.getElementById("expense-chart");
  
  // Group by category
  const categories = {};
  expenses.forEach(expense => {
    categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
  });

  const chartData = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0"
      ]
    }]
  };

  // Destroy previous chart if exists
  if (window.expenseChart) {
    window.expenseChart.destroy();
  }

  window.expenseChart = new Chart(ctx, {
    type: "pie",
    data: chartData,
    options: { responsive: true }
  });
}

// Initial render
renderExpenses();
renderChart();