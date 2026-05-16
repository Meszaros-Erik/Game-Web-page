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