import {Server} from "./index.js";

$(() => {
    console.log("Add Transaction initialized");

    init();
});

function init() {
    // Bei Click Daten auf den Server hochladen
    document.getElementById("upload-button").addEventListener("click", () => {

        const date = document.getElementById("date").value;
        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;

        if (!date || !amount || !category) {
            return;
        }

        const file = {date: date, amount: parseFloat(amount.toFixed(2)), category: category};
        Server.uploadToServer(file);
    });
}