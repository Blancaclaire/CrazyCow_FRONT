// $(document).ready(function() {
//     $('#loginForm').submit(function(e) {
//         e.preventDefault();
        
//         const usernameEmail = $('#usernameEmail').val();
//         const password = $('#password').val();
        
//         $.ajax({
//             url: 'Controller.Actions.CustomersAction', // Ajusta esta URL según tu configuración
//             type: 'POST',
//             data: {
//                 action: 'LOGIN',
//                 usernameEmail: usernameEmail,
//                 password: password
//             },
//             dataType: 'json',
//             success: function(response) {
//                 if (response.message) {
//                     // Error en el login
//                     $('#loginMessage').removeClass('success-message').addClass('error-message').text(response.message);
//                 } else {
//                     // Login exitoso
//                     $('#loginMessage').removeClass('error-message').addClass('success-message').text('Login successful! Redirecting...');
                    
//                     // Guarda los datos del usuario en sessionStorage
//                     sessionStorage.setItem('currentUser', JSON.stringify(response));
                    
//                     // Redirige después de 1 segundo
//                     setTimeout(function() {
//                         window.location.href = '../html/index.html';
//                     }, 1000);
//                 }
//             },
//             error: function(xhr, status, error) {
//                 $('#loginMessage').removeClass('success-message').addClass('error-message').text('Error: ' + error);
//             }
//         });
//     });
// });


// Esperar a que la página cargue
document.addEventListener('DOMContentLoaded', function() {
    

    // Botón para mostrar contraseña

    
    const mostrarBtn = document.querySelector('.password-toggle');
    const passInput = document.getElementById('password');
    
    if (mostrarBtn && passInput) {
        mostrarBtn.addEventListener('click', function() {
            passInput.type = (passInput.type === 'password') ? 'text' : 'password';
        });
    }
    
    //  Formulario de login
    
    const formulario = document.getElementById('loginForm');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('usernameEmail').value.trim();
            const pass = document.getElementById('password').value;
            const mensaje = document.getElementById('loginMessage');
            
            // Validación de campos vacíos
            if (!email || !pass) {
                mostrarError(mensaje, 'Ingresa email y contraseña');
                return;
            }
            
            // Validación de formato de email mejorada
            if (!validarEmail(email)) {
                mostrarError(mensaje, 'Ingresa un email válido');
                return;
            }
            
            // Mostrar mensaje de carga
            mostrarInfo(mensaje, 'We are loading...');
            
            // Enviar datos al servidor
            fetch('http://localhost:8080/CrazyCow_Server/Controller', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `ACTION=CUSTOMER.LOGIN&email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error in server response');
                }
                return res.text();
            })
            .then(respuesta => {
                respuesta = respuesta.trim(); // Limpiar posibles espacios
                
                if (respuesta === "OK") {
                    // Login exitoso
                    mostrarExito(mensaje, 'Moo-velous! Redirecting to the pasture!!');
                    sessionStorage.setItem('userEmail', email);
                    
                    // Redirigir después de 2 segundo
                    setTimeout(() => {
                        window.location.href = '../html/shopping-cart.html';
                    }, 2000);
                } else if (respuesta === "NO") {
                    // Credenciales incorrectas
                    mostrarError(mensaje, 'Incorrect email or password');
                } else {
                    // Respuesta inesperada del servidor
                    mostrarError(mensaje, 'Unexpected error. Please try again');
                }
            })
            .catch(error => {
                console.error('Error in the application:', error);
                mostrarError(mensaje, 'Error connecting to the server');
            });
        });
    }
    
    // Funciones auxiliares
    
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function mostrarError(elemento, mensaje) {
        elemento.textContent = mensaje;
        elemento.className = 'error-message';
    }
    
    function mostrarExito(elemento, mensaje) {
        elemento.textContent = mensaje;
        elemento.className = 'success-message';
    }
    
    function mostrarInfo(elemento, mensaje) {
        elemento.textContent = mensaje;
        elemento.className = 'info-message';
    }
});