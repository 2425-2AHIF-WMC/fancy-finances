import {Server} from "./index.js";

let data = [];

$(() => {
    console.log("Summary initialized");
    init();

});

async function init() {
    data = await Server.downloadFromServer();
    updateSummary();
}

function updateSummary() {
    let income = 0;
    let expenses = 0;

    for (let entry of data) {
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