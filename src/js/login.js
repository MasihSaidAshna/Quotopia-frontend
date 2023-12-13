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

    // Check if the user is already logged in
    const authToken = localStorage.getItem('token');
    if (authToken) {
        // User is logged in, update the navigation bar
        updateNavigationBar(true);
    }
});

function loginUser(username, password) {
    // Make a fetch request to your login endpoint
    fetch('http://localhost:8080/login', {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({username, password}),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response, e.g., save the token to local storage
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);

            $('#loginModal').modal('hide');

            // Update the navigation bar after login
            updateNavigationBar(true);
        })
        .catch(error => console.error('Login failed:', error));
    alert('Login failed. Please check your username and password.');
}

function signupUser(username, password) {
    const authToken = localStorage.getItem('token');

    fetch('http://localhost:8080/signup', {
        method: 'POST', headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken,
        }, body: JSON.stringify({username, password}),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Signup failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Signup successful:', data);
            // Update the navigation bar after signup
            updateNavigationBar(true);
        })
        .catch(error => console.error('Signup failed:', error.message));
}

function updateNavigationBar(isLoggedIn) {
    // Update the navigation bar based on the user's logged-in state
    const rightNavLinks = document.querySelectorAll('.navbar-nav.mr-auto li');
    const authLinks = document.getElementById('authLinks');
    const leftNavLinks = document.querySelectorAll('.navbar-nav.ml-auto li');
    const newPageLink = document.createElement('li');
    newPageLink.classList.add('nav-item');
    newPageLink.innerHTML = '<a class="nav-link" href="../html/edit.html">Admin Panel</a>';

    if (isLoggedIn) {
        // User is logged in, update the navigation bar
        rightNavLinks.forEach(link => link.style.display = 'none');
        authLinks.innerHTML = '<li class="nav-item"><a class="nav-link" href="#" style="color: red; font-weight: bolder"  onclick="logoutUser()">Sign Out</a></li>';
        leftNavLinks.forEach(link => link.style.display = 'inline-block');

        // Add the new page link for logged-in users
        document.querySelector('.navbar-nav').appendChild(newPageLink);
    } else {
        // User is not logged in, restore the original navigation bar
        rightNavLinks.forEach(link => link.style.display = 'inline-block');
        authLinks.innerHTML = '<li class="nav-item"><a class="nav-link mr-3" data-target="#loginModal" data-toggle="modal" href="#">Login</a></li>' + '<li class="nav-item"><a class="nav-link" data-target="#signupModal" data-toggle="modal" href="#">Sign Up</a></li>'
        leftNavLinks.forEach(link => link.style.display = 'none');

        // Remove the new page link for non-logged-in users
        if (newPageLink.parentNode) {
            newPageLink.parentNode.removeChild(newPageLink);
        }
    }
}

function logoutUser() {
    // Clear the token from local storage
    localStorage.removeItem('token');

    // Update the navigation bar after logout
    updateNavigationBar(false);
}
