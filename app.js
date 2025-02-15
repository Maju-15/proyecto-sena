const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', { style: 'decimal', minimumFractionDigits: 2 }).format(value);
}

function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    document.getElementById('balance').textContent = `Saldo Actual: $${formatCurrency(balance)}`;
}

function renderTransactions() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = transactions.map((transaction, index) => `
        <li>
            ${transaction.description} - $${formatCurrency(transaction.amount)} (${transaction.category})
            <button class="delete-btn" onclick="deleteTransaction(${index})">🗑️ Borrar</button>
        </li>
    `).join('');
}

function addTransaction(description, amount, category) {
    const transaction = { description, amount: parseFloat(amount.replace('.', '').replace(',', '.')), category };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateBalance();
    renderTransactions();
    updateChart();
}

function deleteTransaction(index) {
    if (confirm("¿Estás seguro de que quieres eliminar esta transacción?")) {
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateBalance();
        renderTransactions();
        updateChart();
    }
}

document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    if (!description || !amount || isNaN(parseFloat(amount.replace('.', '').replace(',', '.')))) {
        alert("Por favor, ingresa una descripción y un monto válido.");
        return;
    }

    addTransaction(description, amount, category);
    document.getElementById('transaction-form').reset();
});

document.addEventListener('DOMContentLoaded', () => {
    updateBalance();
    renderTransactions();
    updateChart();
});

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Comida', 'Transporte', 'Arriendo', 'Servicios', 'Otros'],
        datasets: [{
            label: 'Gastos por Categoría',
            data: [0, 0, 0, 0, 0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

function updateChart() {
    const categories = ['comida', 'transporte', 'arriendo', 'servicios', 'otros'];
    const data = categories.map(category => 
        transactions.filter(t => t.category === category).reduce((acc, t) => acc + t.amount, 0)
    );
    chart.data.datasets[0].data = data;
    chart.update();
}
