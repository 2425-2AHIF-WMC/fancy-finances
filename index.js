/** Hilfe für Webstorm, weil sonst ein Fehler kommt ohne das es einen gibt
 * @property {string} date
 * @property {number} amount
 * @property {string} category
 */

let data = [];


function createTableRow() {
    const tbody = document.getElementById("finance-table-body");
    let html = "";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];

        html += `<tr>
                    <td>${row.date}</td>
                    <td>${row.amount}€</td>
                    <td>${row.category}</td>
                </tr>`;
    }

    tbody.innerHTML = html;
}

function showSaldo() {

    const labels = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    let incomeData = Array(12).fill(0);
    let expenseData = Array(12).fill(0);

    for (const entry of data) {
        const amount = parseFloat(entry.amount);
        if (isNaN(amount)) continue;

        const monthIndex = new Date(entry.date).getMonth();
        if (monthIndex < 0 || monthIndex > 11) continue;

        if (amount >= 0) {
            incomeData[monthIndex] += amount;
        } else {
            expenseData[monthIndex] += Math.abs(amount);
        }
    }

    const safeReduce = arr => arr.reduce((a, b) => (isNaN(b) ? a : a + b), 0);

    const totalIncome = safeReduce(incomeData);
    const totalExpense = safeReduce(expenseData);
    const balance = totalIncome - totalExpense;

    document.getElementById('balanceAmount').textContent = `€ ${balance.toLocaleString('de-DE')}`;

    const commonOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#333', font: { size: 14 } },
                grid: { color: '#eee' }
            },
            x: {
                ticks: { color: '#333', font: { size: 14 } },
                grid: { color: '#fafafa' }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#333',
                titleColor: '#fff',
                bodyColor: '#fff',
                mode: 'index',
                intersect: false
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Einnahmen-Chart
    const ctxIncome = document.getElementById('incomeChart').getContext('2d');
    new Chart(ctxIncome, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Einnahmen',
                data: incomeData,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointHoverRadius: 7,
            }]
        },
        options: commonOptions
    });

    // Ausgaben-Chart
    const ctxExpense = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctxExpense, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ausgaben',
                data: expenseData,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointHoverRadius: 7,
            }]
        },
        options: commonOptions
    });
}

async function init() {
    const spinner = document.getElementById("spinner-container");
    try {

        data = await Server.downloadFromServer();
    } catch (e) {
        console.error("Error downloading data from server", e);
        spinner.style.display = "none";
        return;
    } finally {
        spinner.style.display = "none";
    }

    let sorted = data.slice();
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    data = sorted;
    createTableRow();

    const table = document.getElementById("finance-table");
    if (table) {
        table.classList.add("visible");
    }

    showSaldo();
}

function sortAfterSelection() {
    const select = document.getElementById("sort-select");
    if (!select) return;

    select.addEventListener("change", (e) => {
        const value = e.target.value;

        let sorted = data.slice();

        if (value === "date") {
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (value === "amount") {
            sorted.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
        } else if (value === "category") {
            sorted.sort((a, b) => a.category.localeCompare(b.category));
        }

        data = sorted;
        createTableRow();
        const table = document.getElementById("finance-table");
        if (table) {
            table.classList.add("visible");
        }
    });
}

$(() => {
    console.log("initialized");

    init();
    sortAfterSelection();
});

export class Server {

    static async uploadToServer(file, url = "http://localhost:3000/bookings") {
        console.log("Uploading to server");

        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(file)
        });
    }

    static async downloadFromServer(url = "http://localhost:3000/bookings") {
        console.log("Downloading from server");

        const response = await fetch(url);
        return response.json();
    }
}