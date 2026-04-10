document.addEventListener("DOMContentLoaded", () => {
    // Active scroll menu
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

    // Menu toggle functionality
    const menuIcon = document.getElementById("menu-btn"); 
    const navbar = document.querySelector(".navbar"); 
    const toggler = document.getElementById("toggler"); 

    if (menuIcon && navbar && toggler) {
        // Menu toggle(checkbox) treatment
        toggler.addEventListener("change", () => {
            if (toggler.checked) {
                navbar.classList.add("open"); 
            } else {
                navbar.classList.remove("open"); 
            }
        });

        // If the user clicks the menu icon
        menuIcon.addEventListener("click", () => {
            toggler.checked = !toggler.checked;
        });
    } else {
        console.warn('Navbar, Toggler or Menu Icon not found!');
    }
});

// --- Dark mode toggle functionality ---
const toggleIcon = document.querySelector('.toggle-icon');

toggleIcon.addEventListener('click', () => {
    toggleIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
});

// --- Connection functions ---
const form = document.querySelector('form');
const fullName = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const subject = document.getElementById('subject');
const mess = document.getElementById('message');

function sendEmail() {
    // Collecting data into an object
    const formData = {
        name: fullName.value,
        email: email.value,
        phone: phone.value,
        subject: subject.value,
        message: mess.value
    };

    // Sending to your own Node.js server
    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Success!",
                text: "Your message has been sent to the server!",
                showConfirmButton: false,
                timer: 2000
            });
            form.reset(); // Reset form fields
        } else {
            throw new Error('Server error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while sending the message. Is the server running?",
        });
    });
}

function checkInputs() {
    const items = document.querySelectorAll('.item');
    let hasError = false;

    for (const item of items) {
        item.parentElement.classList.remove('error');
        if (item.value.trim() == '') {
            item.parentElement.classList.add('error');
            hasError = true;
        }
    }

    if (email.value != '') {
        if (checkEmail()) {
            hasError = true;
        }
    }
    return hasError;
}

function checkEmail() {
    const emailRegex = /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
    const emailParent = email.parentElement;
    const errorTxt = emailParent.querySelector('.error-text');
    let isInvalid = false;

    emailParent.classList.remove('error');

    if (email.value == "") {
        emailParent.classList.add('error');
        if (errorTxt) errorTxt.innerText = "Email Address can't be blank";
        isInvalid = true;
    } else if (!email.value.match(emailRegex)) {
        emailParent.classList.add('error');
        if (errorTxt) errorTxt.innerText = "Enter a valid email address";
        isInvalid = true;
    }

    return isInvalid;
}

// Monitor fields while typing (suppress error messages)
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('keyup', () => {
        if (item.value != '') {
            item.parentElement.classList.remove('error');
        } else {
            item.parentElement.classList.add('error');
        }
    });
});

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isError = checkInputs();

    if (!isError) {
        sendEmail();
    } else {
        console.log("The form contains errors, not submitting.");
    }
});