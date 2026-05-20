// Instant check
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

// Toggle button behavior after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const toggleIcon = document.querySelector('.toggle-icon');

    if (toggleIcon) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            toggleIcon.classList.remove('bx-moon');
            toggleIcon.classList.add('bx-sun');
        } else {
            toggleIcon.classList.remove('bx-sun');
            toggleIcon.classList.add('bx-moon');
        }
        
        toggleIcon.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                toggleIcon.classList.remove('bx-moon');
                toggleIcon.classList.add('bx-sun');
            } else {
                localStorage.setItem('darkMode', 'disabled');
                toggleIcon.classList.remove('bx-sun');
                toggleIcon.classList.add('bx-moon');
            }
        });
    }
});

// Scroll
const liLinks = document.querySelectorAll("header .navbar a");
const sections = document.querySelectorAll("section");

if (liLinks.length > 0 && sections.length > 0) {
    function activeMenu() {
        let secLength = sections.length;
        while (--secLength && window.scrollY + 500 < sections[secLength].offsetTop) {}
        liLinks.forEach((link, index) => {
            if (index === secLength) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
    let debounceTimeout;
    window.addEventListener("scroll", () => {
        clearTimeout(debounceTimeout); 
        debounceTimeout = setTimeout(activeMenu, 50); 
    });
}

// Mobil Menu Open/Close
const menuIcon = document.getElementById("menu-btn"); 
const navbar = document.querySelector(".navbar"); 
const toggler = document.getElementById("toggler"); 
if (menuIcon && navbar && toggler) {
    toggler.addEventListener("change", () => {
        if (toggler.checked) {
            navbar.classList.add("open"); 
        } else {
            navbar.classList.remove("open"); 
        }
    });

    menuIcon.addEventListener("click", () => {
        toggler.checked = !toggler.checked;
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.classList.add('toast');

    if (type === 'error') toast.classList.add('toast-error');
    if (type === 'warning') toast.classList.add('toast-warning');

    let icon = "<i class='bx bxs-check-circle'></i>";
    if (type === 'error') icon = "<i class='bx bxs-error-circle'></i>";
    if (type === 'warning') icon = "<i class='bx bxs-attention'></i>";

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

document.addEventListener("DOMContentLoaded", async () => {
    
    // User Profile & Menu Logic
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const profileName = document.getElementById('profileName');
    const dashboardLink = document.getElementById('dashboardLink');
    const profileTrigger = document.getElementById('profileTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const profileImg = document.querySelector('#profileTrigger .profile-img');

    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    if (loggedInUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'inline-block';
        if (profileName) profileName.textContent = loggedInUser.username;

        if (loggedInUser.role === 1) {
            dashboardLink.href = '/Admin Dashbord/index.html';
            if (profileImg) profileImg.src = "../image/admin-avatar.png"; 
        } else {
            dashboardLink.href = '/User Dashboard/index.html';
            if (profileImg) profileImg.src = "../image/Robot-avatar.png";
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (userProfile) userProfile.style.display = 'none';
    }

    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (dropdownMenu && dropdownMenu.classList.contains('show') && !userProfile.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/index.html'; 
        });
    }
});