document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Send username and password as JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            // Redirect to the user's tasks page or dashboard
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const fullName = document.getElementById('full-name').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('signup-email').value;

    const formData = {
        fullName,
        username,
        password,
        email
    };

    fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Signup successful!');
        // Handle success (e.g., redirect to login page or clear form)
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Signup failed: ' + (error.error || 'Unknown error'));
    });
});