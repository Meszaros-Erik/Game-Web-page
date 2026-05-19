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
    
    // Típus alapján egyedi osztályt adunk hozzá a CSS-hez
    if (type === 'error') toast.classList.add('toast-error');
    if (type === 'warning') toast.classList.add('toast-warning');

    // Kiválasztjuk a megfelelő ikont a Boxicons-ból
    let icon = "<i class='bx bxs-check-circle'></i>"; // alapértelmezett zöld pipa
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