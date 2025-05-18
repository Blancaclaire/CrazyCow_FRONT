
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');
    const messageElement = document.getElementById('loginMessage');

    // Toggle para mostrar/ocultar contraseña
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        });
    }

    // Manejo del envío del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('usernameEmail').value.trim();
            const password = document.getElementById('password').value;

            // Validaciones básicas
            if (!email || !password) {
                showMessage(messageElement, 'Por favor ingresa email y contraseña', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage(messageElement, 'Por favor ingresa un email válido', 'error');
                return;
            }

            showMessage(messageElement, 'Verificando credenciales...', 'info');

            try {
                // 1. Primero validamos las credenciales
                const loginResponse = await validateCredentials(email, password);
                
                if (loginResponse === "OK") {
                    // 2. Si el login es exitoso, obtenemos los datos completos del cliente
                    const customerData = await fetchCustomerData(email);
                    
                    if (customerData) {
                        // 3. Guardamos los datos relevantes en localStorage
                        saveCustomerData(customerData);
                        
                        showMessage(messageElement, '¡Bienvenido! Redirigiendo...', 'success');
                        
                        // Redirigir después de 1.5 segundos
                        setTimeout(() => {
                            window.location.href = '../html/payment.html';
                        }, 1500);
                    } else {
                        showMessage(messageElement, 'Error al obtener datos del cliente', 'error');
                    }
                } else {
                    showMessage(messageElement, 'Email o contraseña incorrectos', 'error');
                }
            } catch (error) {
                console.error('Error en el proceso de login:', error);
                showMessage(messageElement, 'Error de conexión con el servidor', 'error');
            }
        });
    }

    // Función para validar credenciales
    async function validateCredentials(email, password) {
        const url = `http://localhost:8080/CrazyCow_Server/Controller?ACTION=CUSTOMER.LOGIN&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        return response.text();
    }

    // Función para obtener datos del cliente
    async function fetchCustomerData(email) {
        const url = `http://localhost:8080/CrazyCow_Server/Controller?ACTION=CUSTOMER.FIND_BY_EMAIL&email=${encodeURIComponent(email)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos del cliente');
        }

        return response.json();
    }

    // Función para guardar datos del cliente
    function saveCustomerData(customerData) {
        // Guardamos solo la información necesaria
        // localStorage.setItem('customerData', JSON.stringify({
        //     id: customerData.customer_id,
        //     email: customerData.email,
        //     name: customerData.name,
        //     surname: customerData.surname,
        //     phone: customerData.phone_number,
        //     address: customerData.address
        // }));
        localStorage.setItem('customer_id', customerData.customer_id);
        localStorage.setItem('isLoggedIn', 'true');
    }

    // Función para validar email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Función para mostrar mensajes
    function showMessage(element, message, type) {
        if (!element) return;
        
        element.textContent = message;
        element.className = `${type}-message`;
    }
});