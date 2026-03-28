const API_URL = 'http://localhost:3000';
const signupForm = document.getElementById('signupForm');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            signupError.style.display = 'none';
            signupSuccess.textContent = 'Account created successfully! Redirecting to login...';
            signupSuccess.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            signupSuccess.style.display = 'none';
            signupError.textContent = data.error || 'Failed to create account';
            signupError.style.display = 'block';
        }
    } catch (error) {
        console.error('Signup error:', error);
        signupSuccess.style.display = 'none';
        signupError.textContent = 'Cannot connect to the server.';
        signupError.style.display = 'block';
    }
});
