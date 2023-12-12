document.addEventListener("DOMContentLoaded", function () {
    // Event listener for login form
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        loginUser(username, password);
    });

    // Event listener for signup form
    document.getElementById('signupForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        signupUser(username, password);
    });
});

function loginUser(username, password) {
    // Make a fetch request to your login endpoint
    fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({username, password}),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response, e.g., save the token to local storage
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);
            window.location.href = '../html/newquotes.html';
        })
        .catch(error => console.error('Login failed:', error));
}

function signupUser(username, password) {
    const authToken = localStorage.getItem('token');

    fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken,
        },
        body: JSON.stringify({ username, password } ),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Signup failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Signup successful:', data);
            window.location.href = 'signup-success.html';
        })
        .catch(error => console.error('Signup failed:', error.message));
}
