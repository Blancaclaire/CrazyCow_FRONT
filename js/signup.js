// // Script para el menú desplegable
// document.addEventListener('DOMContentLoaded', function () {
//     const navToggle = document.getElementById('navToggle');
//     const navMenu = document.getElementById('navMenu');
//     const passwordToggle = document.getElementById('passwordToggle');
//     const passwordInput = document.getElementById('password');

//     // Función para alternar el menú
//     navToggle.addEventListener('click', function () {
//         navToggle.classList.toggle('active');
//         navMenu.classList.toggle('active');
//     });

//     // Cerrar el menú al hacer clic fuera de él
//     document.addEventListener('click', function (event) {
//         const isNavToggle = event.target === navToggle || navToggle.contains(event.target);
//         const isNavMenu = event.target === navMenu || navMenu.contains(event.target);

//         if (!isNavToggle && !isNavMenu && navMenu.classList.contains('active')) {
//             navToggle.classList.remove('active');
//             navMenu.classList.remove('active');
//         }
//     });

//     // Mostrar/ocultar contraseña
//     passwordToggle.addEventListener('click', function () {
//         if (passwordInput.type === 'password') {
//             passwordInput.type = 'text';
//         } else {
//             passwordInput.type = 'password';
//         }
//     });
// });


// document.querySelectorAll('.tab-button').forEach(button => {
//     button.addEventListener('click', () => {
//         const tab = button.getAttribute('data-tab');
//         // Redirige a la sección correspondiente en products-menu.html
//         window.location.href = `../html/products-menu.html#${tab}`;
//     });
// });




// Script para gestionar el formulario de registro de usuarios
document.addEventListener('DOMContentLoaded', function() {
    // Espera a que todo el DOM esté cargado antes de ejecutar el código
    
    // ----- CONFIGURACIÓN DEL TOGGLE DE VISIBILIDAD DE CONTRASEÑA -----
    // Selecciona el botón que alternará la visibilidad de la contraseña
    const passwordToggle = document.querySelector('.password-toggle');
    // Selecciona el campo de contraseña
    const passwordInput = document.getElementById('password');
    
    // Verifica que ambos elementos existan en el DOM antes de configurar el evento
    if (passwordToggle && passwordInput) {
        // Configura un evento de clic en el botón de toggle
        passwordToggle.addEventListener('click', function() {
            // Alterna el tipo del input entre 'password' (oculto) y 'text' (visible)
            passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
        });
    }
    
    // ----- MANEJO DEL FORMULARIO DE REGISTRO -----
    // Obtiene la referencia al formulario de registro
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        // Agrega un evento para cuando se envía el formulario
        signupForm.addEventListener('submit', function(e) {
            // Previene el comportamiento predeterminado (recarga de página)
            e.preventDefault();
            
            // ----- EXTRACCIÓN DE DATOS DEL FORMULARIO -----
            // Obtiene los valores ingresados por el usuario
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            // Obtiene el elemento donde se mostrarán los mensajes de éxito o error
            const signupMessage = document.getElementById('signupMessage');
            
            // ----- ENVÍO DE LA PETICIÓN AL SERVIDOR -----
            // Realiza una petición HTTP al servidor para registrar al usuario
            // Nota: Utiliza valores predeterminados para algunos campos (name, surname, etc.)
            fetch(`http://localhost:8080/CrazyCow_Server/Controller?ACTION=CUSTOMER.REGISTER&user_name=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&name=User&surname=User&phone_number=000000000&address=Address`)
                .then(response => response.text()) // Convierte la respuesta a texto
                .then(data => {
                    // ----- PROCESAMIENTO DE LA RESPUESTA -----
                    if (data === "" || data === "OK") {
                        // Si la respuesta está vacía o es "OK", el registro fue exitoso
                        if (signupMessage) {
                            // Muestra mensaje de éxito
                            signupMessage.textContent = 'Registration successful! Redirecting...';
                            signupMessage.className = 'success-message';
                        }
                        
                        // Redirecciona al usuario a la página de login después de 1 segundo
                        setTimeout(() => {
                            window.location.href = '../html/login.html';
                        }, 1000);
                    } else {
                        // Si la respuesta contiene otro valor, el registro falló
                        if (signupMessage) {
                            // Muestra mensaje de error
                            signupMessage.textContent = 'Registration failed';
                            signupMessage.className = 'error-message';
                        }
                    }
                })
                .catch(error => {
                    // ----- MANEJO DE ERRORES DE CONEXIÓN -----
                    // Si hay un error en la conexión con el servidor
                    if (signupMessage) {
                        // Muestra mensaje de error de conexión
                        signupMessage.textContent = 'Connection error';
                        signupMessage.className = 'error-message';
                    }
                });
        });
    }
});