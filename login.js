import {Server} from "./index.js";

let users = [];
let current = null;
let nextId = 2;

// Login function
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) {
        alert("loginError', 'Please fill in all fields");
        return;
    }
    // Check if user exists in "database"
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        current = user;
        document.getElementById('current').textContent = user.email;
        window.location.href = "index.html";
        // Clear form
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        alert("loginError', 'Invalid email or password");
    }
}

// Register function
async function register() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    if (email === null && password === null) {
        alert("registerError', 'Please fill in all fields");
        return;
    }
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        alert("registerError', 'Username already exists");
        return;
    }

    // Add new user to "database"
    const newUser = {
        id: nextId++,
        email: email,
        password: password
    };

   const response = await Server.uploadToServer(newUser, `http://localhost:3000/users`);

    if (!response.ok) {
        alert("Fehler beim Hochladen: " + response.status);
        return;
    }

    console.log('registerSuccess', 'Registration successful! You can now login.');
    // Clear form
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    // Auto switch to login after 2 seconds
    setTimeout(() => {
        console.log('registration successful');
        window.location.href = "login.html";
    }, 3000);
}
// Logout function
function logout() {
    current = null;
    console.log('logout');
}

$(async () => {
    users = await Server.downloadFromServer(`http://localhost:3000/users`);

    const path = window.location.pathname;

    if (path.endsWith("register.html")) {
        document.getElementById("registerBtn").addEventListener("click", register);
    } else if (path.endsWith("login.html") || path.endsWith("index.html") || path === "/") {
        document.getElementById("loginBtn").addEventListener("click", login);
    }
});




// Display current users in console (for testing)
console.log('Current users in database:', users);
console.log('Try logging in with: admin@test.com/admin123 or user@test.com/user123');