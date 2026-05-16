const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const toRegisterMobile = document.getElementById('to-register-mobile');
const toLoginMobile = document.getElementById('to-login-mobile');

// Desktop → Mobil
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

toRegisterMobile.addEventListener('click', () => {
    container.classList.add("active");
});

toLoginMobile.addEventListener('click', () => {
    container.classList.remove("active");
});

// Toggle password visibility
function setupPasswordToggle(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleIconId);

    if (!passwordInput || !toggleIcon) return;

    toggleIcon.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);     
        this.classList.toggle('bx-hide');
        this.classList.toggle('bx-show');
    });
}

setupPasswordToggle('login-password', 'toggle-login-password');
setupPasswordToggle('register-password', 'toggle-register-password');

// Login section
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            if (data.role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/user/home';
            }
        } else {
            alert(data.message || 'Error while logging in!');
        }

    } catch (error) {
        console.error('Szerver error:', error);
        alert('Could not connect to the server! Please try again later.');
    }
});