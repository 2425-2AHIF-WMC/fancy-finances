/** Hilfe für Webstorm, weil sonst ein Fehler kommt ohne das es einen gibt
 * @property {string} date
 * @property {number} amount
 * @property {string} category
 */

let data = [];



function createTableRow(){
    const tbody = document.getElementById("finance-table-body");
    let html="";

    for(let i=0; i<data.length; i++)
    {
        const row = data[i];

        html += `<tr>
                    <td>${row.date}</td>
                    <td>${row.amount}€</td>
                    <td>${row.category}</td>
                </tr>`;
    }

    tbody.innerHTML = html;
}



async function init()
{
    const spinner = document.getElementById("spinner-container");
    try {

        data = await Server.downloadFromServer();
    }
    catch (e) {
        console.error("Error downloading data from server", e);
        spinner.style.display = "none";
        return;
    }
    finally{
        spinner.style.display = "none";
    }

    let sorted = data.slice();
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    data= sorted;
    createTableRow();

    const table = document.getElementById("finance-table");
    if (table) {
        table.classList.add("visible");
    }
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

$(()=>{
    console.log("initialized");

    init();
    sortAfterSelection();
});

export class Server{

    static async uploadToServer(file)
    {
        console.log("Uploading to server");

        return await fetch("http://localhost:3000/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(file)
        });
    }

    static async downloadFromServer()
    {
        console.log("Downloading from server");

        const response =  await fetch(`http://localhost:3000/bookings`);
        return response.json();
    }
}