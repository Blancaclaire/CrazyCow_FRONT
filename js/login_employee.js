// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Detectar en qué página estamos mediante elementos HTML
    const loginForm = document.getElementById('loginForm');
    const employeeInfoSection = document.querySelector('.employee-info');
    
    if (loginForm) {
        // Estamos en la página de login - inicializar funcionalidad
        initializeLoginPage();
    } else if (employeeInfoSection) {
        // Estamos en la página de detalles de empleado - cargar datos
        initializeEmployeeDetailsPage();
    }
});


function initializeLoginPage() {
    // Configurar el botón para mostrar/ocultar contraseña
    const mostrarBtn = document.querySelector('.password-toggle');
    const passInput = document.getElementById('password');
    
    if (mostrarBtn && passInput) {
        mostrarBtn.addEventListener('click', function() {
            passInput.type = (passInput.type === 'password') ? 'text' : 'password';
        });
    }
    
    // Manejar el envío del formulario de login
    const formulario = document.getElementById('loginForm');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const email = document.getElementById('usernameEmail').value.trim();
            const pass = document.getElementById('password').value;
            const mensaje = document.getElementById('loginMessage');
            
            /* Validación de campos */
            if (!email || !pass) {
                mostrarError(mensaje, 'Please enter both email and password');
                return;
            }
            
            // Validar formato de email
            if (!validarEmail(email)) {
                mostrarError(mensaje, 'Please enter a valid email address');
                return;
            }
            
            // Mostrar mensaje de carga
            mostrarInfo(mensaje, 'Authenticating...');
            
            
            fetch(`http://localhost:8080/CrazyCow_Server/Controller?ACTION=EMPLOYEE.LOGIN&email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`, {
                method: 'GET' // Usamos GET como espera el controlador Java
            })
            .then(res => {
                if (!res.ok) throw new Error('Server response error');
                return res.text();
            })
            .then(respuesta => {
                respuesta = respuesta.trim();
                
                // Manejar diferentes respuestas del servidor
                if (respuesta === "OK") {
                    // Login exitoso
                    mostrarExito(mensaje, 'Login successful! Redirecting...');
                    
                    // Guardar email en sessionStorage
                    sessionStorage.setItem('employeeEmail', email);
                    
                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        window.location.href = '../html/employee-details.html';
                    }, 2000);
                } else if (respuesta === "NO") {
                    // Credenciales incorrectas
                    mostrarError(mensaje, 'Invalid email or password');
                } else {
                    // Respuesta inesperada del servidor
                    mostrarError(mensaje, 'Unexpected error. Please try again');
                    console.error('Server response:', respuesta);
                }
            })
            .catch(error => {
                console.error('Application error:', error);
                mostrarError(mensaje, 'Connection error. Please try again');
            });
        });
    }
}


// Validar formato de email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Mostrar mensaje de error
function mostrarError(elemento, mensaje) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = 'error-message';
    } else {
        console.error(mensaje);
    }
}

// Mostrar mensaje de éxito
function mostrarExito(elemento, mensaje) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = 'success-message';
    } else {
        console.log(mensaje);
    }
}

// Mostrar mensaje informativo
function mostrarInfo(elemento, mensaje) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = 'info-message';
    } else {
        console.log(mensaje);
    }
}