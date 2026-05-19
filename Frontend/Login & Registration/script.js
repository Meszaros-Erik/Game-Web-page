document.addEventListener("DOMContentLoaded", () => {
    
    // --- Toast Notifications ---
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.classList.add('toast');
        if (type === 'error') toast.classList.add('toast-error');
        if (type === 'warning') toast.classList.add('toast-warning');

        let icon = "<i class='bx bxs-check-circle'></i>";
        if (type === 'error') icon = "<i class='bx bxs-error-circle'></i>";
        if (type === 'warning') icon = "<i class='bx bxs-attention'></i>";

        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    }

    // --- UI Toggle Logic ---
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const toRegisterMobile = document.getElementById('to-register-mobile');
    const toLoginMobile = document.getElementById('to-login-mobile');

    if (registerBtn) registerBtn.addEventListener('click', () => container.classList.add("active"));
    if (loginBtn) loginBtn.addEventListener('click', () => container.classList.remove("active"));
    if (toRegisterMobile) toRegisterMobile.addEventListener('click', () => container.classList.add("active"));
    if (toLoginMobile) toLoginMobile.addEventListener('click', () => container.classList.remove("active"));

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

    // --- Registration Logic ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: name, email: email, password: password })
                });

                const data = await response.json();

                if (data.success) {
                    showToast(data.message, 'success');
                    registerForm.reset();
                    container.classList.remove("active");
                } else {
                    showToast(data.message, 'error');
                }
            } catch (error) {
                console.error('Szerver hiba regisztrációkor:', error);
                showToast('Nem sikerült kapcsolódni a szerverhez!', 'error');
            }
        });
    }

    // --- Login Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: password })
                });

                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                    showToast(data.message, 'success');

                    setTimeout(() => {
                        if (data.user.role === 1) {
                            window.location.href = '/Admin Dashbord/index.html';
                        } else {
                            window.location.href = '/index.html'; 
                        }
                    }, 1000);
                } else {
                    showToast(data.message || 'Error while logging in!', 'error');
                }
            } catch (error) {
                console.error('Server error when logging in:', error);
                showToast('Could not connect to the server!', 'error');
            }
        });
    }
});