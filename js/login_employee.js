/**
 * JavaScript for Crazy Cow Employee System
 * Handles both login and employee profile display functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on based on HTML elements
    const loginForm = document.getElementById('loginForm');
    const employeeInfoSection = document.querySelector('.employee-info');
    
    if (loginForm) {
        // We're on the login page - initialize login functionality
        initializeLoginPage();
    } else if (employeeInfoSection) {
        // We're on the employee details page - load employee data
        initializeEmployeeDetailsPage();
    }
});

// ==================== LOGIN PAGE FUNCTIONS ====================

function initializeLoginPage() {
    // Handle password visibility toggle
    const mostrarBtn = document.querySelector('.password-toggle');
    const passInput = document.getElementById('password');
    
    if (mostrarBtn && passInput) {
        mostrarBtn.addEventListener('click', function() {
            passInput.type = (passInput.type === 'password') ? 'text' : 'password';
        });
    }
    
    // Handle login form submission
    const formulario = document.getElementById('loginForm');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('usernameEmail').value.trim();
            const pass = document.getElementById('password').value;
            const mensaje = document.getElementById('loginMessage');
            
            // Field validation
            if (!email || !pass) {
                mostrarError(mensaje, 'Ingresa email y contraseña');
                return;
            }
            
            // Email format validation
            if (!validarEmail(email)) {
                mostrarError(mensaje, 'Ingresa un email válido');
                return;
            }
            
            // Show loading message
            mostrarInfo(mensaje, 'We are loading...');
            
            // Send login request - Fixed to match Java controller expectations
            // The Java controller expects URL parameters, not form data
            fetch(`http://localhost:8080/CrazyCow_Server/Controller?ACTION=EMPLOYEE.LOGIN&email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`, {
                method: 'GET' // Changed to GET to match the Java controller's expectations
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error in server response');
                }
                return res.text();
            })
            .then(respuesta => {
                respuesta = respuesta.trim();
                
                if (respuesta === "OK") {
                    // Successful login
                    mostrarExito(mensaje, 'Moo-velous! Redirecting to employee dashboard!');
                    
                    // Save user email in sessionStorage
                    sessionStorage.setItem('employeeEmail', email);
                    
                    // Redirect after 2 seconds
                    setTimeout(() => {
                        window.location.href = '../html/employee-details.html';
                    }, 2000);
                } else if (respuesta === "NO") {
                    // Incorrect credentials
                    mostrarError(mensaje, 'Incorrect email or password');
                } else {
                    // Unexpected server response
                    mostrarError(mensaje, 'Unexpected error. Please try again');
                    console.error('Server response:', respuesta);
                }
            })
            .catch(error => {
                console.error('Error in the application:', error);
                mostrarError(mensaje, 'Error connecting to the server');
            });
        });
    }
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function mostrarError(elemento, mensaje) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = 'error-message';
    } else {
        console.error(mensaje);
    }
}

function mostrarExito(elemento, mensaje) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = 'success-message';
    } else {
        console.log(mensaje);
    }
}

function mostrarInfo(elemento, mensaje) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = 'info-message';
    } else {
        console.log(mensaje);
    }
}

