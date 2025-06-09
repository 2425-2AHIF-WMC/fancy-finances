import {Server} from "./index.js";

let data = [];

$(() => {
    console.log("Summary initialized");
    init();

    document.getElementById("timeFilter").addEventListener("change", () => {
        updateSummary();
    });
});

async function init() {
    data = await Server.downloadFromServer();
    updateSummary();
}

function updateSummary() {
    let income = 0;
    let expenses = 0;

    const selectedRange = document.getElementById("timeFilter").value;
    const now = new Date();
    let fromDate;

    switch (selectedRange) {
        case "1m":
            fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            break;
        case "3m":
            fromDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            break;
        case "6m":
            fromDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
            break;
        case "1y":
            fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            break;
        default:
            fromDate = null;
    }

    const filteredData = fromDate
        ? data.filter(entry => new Date(entry.date) >= fromDate)
        : data;

    for (let entry of filteredData) {
        const amount = parseFloat(entry.amount);
        if (amount >= 0) {
            income += amount;
        } else {
            expenses += Math.abs(amount);
        }
    }

    const totalIncomeEl = document.getElementById("total-income");
    const totalExpensesEl = document.getElementById("total-expenses");
    const balanceEl = document.getElementById("balance");

    totalIncomeEl.textContent = income.toFixed(2) + "€";
    totalExpensesEl.textContent = expenses.toFixed(2) + "€";
    balanceEl.textContent = (income - expenses).toFixed(2) + "€";

    totalIncomeEl.classList.add("green");
    totalExpensesEl.classList.add("red");

    balanceEl.classList.remove("green", "red");
    if (income - expenses >= 0) {
        balanceEl.classList.add("green");
    } else {
        balanceEl.classList.add("red");
    }
}