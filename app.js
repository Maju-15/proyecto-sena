const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    document.getElementById('balance').textContent = `Saldo Actual: $${balance.toFixed(2)}`;
}

function renderTransactions() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = transactions.map((transaction, index) => `
        <li>
            ${transaction.description} - $${transaction.amount.toFixed(2)} (${transaction.category})
            <button class="delete-btn" onclick="deleteTransaction(${index})">Borrar</button>
        </li>
    `).join('');
}

function addTransaction(description, amount, category) {
    const transaction = { description, amount: parseFloat(amount), category };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateBalance();
    renderTransactions();
    updateChart();
}

function deleteTransaction(index) {
    transactions.splice(index, 1); // Elimina la transacción del array
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateBalance();
    renderTransactions();
    updateChart();
}

document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    addTransaction(description, amount, category);
});

updateBalance();
renderTransactions();

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Comida', 'Transporte', 'Arriendo', 'Otros'],
        datasets: [{
            label: 'Gastos por Categoría',
            data: [0, 0, 0, 0], // Inicialmente vacío
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Permite ajustar el tamaño de la gráfica
    }
});

function updateChart() {
    const categories = ['comida', 'transporte', 'Arriendo', 'Otros'];
    const data = categories.map(category => 
        transactions.filter(t => t.category === category).reduce((acc, t) => acc + t.amount, 0)
    );
    chart.data.datasets[0].data = data;
    chart.update();
}