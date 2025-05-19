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
                showMessage(messageElement, 'Please enter both email and password', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage(messageElement, 'Please enter a valid email address', 'error');
                return;
            }

            showMessage(messageElement, 'Verifying credentials...', 'info');

            try {
                // 1. Primero validamos las credenciales
                const loginResponse = await validateCredentials(email, password);
                
                if (loginResponse === "OK") {
                    // 2. Si el login es exitoso, obtenemos los datos completos del cliente
                    const customerData = await fetchCustomerData(email);
                    
                    if (customerData) {
                        // 3. Guardamos los datos relevantes en localStorage
                        saveCustomerData(customerData);
                        
                        showMessage(messageElement, 'Welcome! Redirecting...', 'success');
                        
                        // Redirigir después de 1.5 segundos
                        setTimeout(() => {
                            window.location.href = '../html/payment.html';
                        }, 1500);
                    } else {
                        showMessage(messageElement, 'Error retrieving customer data', 'error');
                    }
                } else {
                    showMessage(messageElement, 'Incorrect email or password', 'error');
                }
            } catch (error) {
                console.error('Login process error:', error);
                showMessage(messageElement, 'Server connection error', 'error');
            }
        });
    }

    // Función para validar credenciales
    async function validateCredentials(email, password) {
        const url = `http://localhost:8080/api/Controller?ACTION=CUSTOMER.LOGIN&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain'
            }
        });

        if (!response.ok) {
            throw new Error('Server response error');
        }

        return response.text();
    }

    // Función para obtener datos del cliente
    async function fetchCustomerData(email) {
        const url = `http://localhost:8080/api/Controller?ACTION=CUSTOMER.FIND_BY_EMAIL&email=${encodeURIComponent(email)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching customer data');
        }

        return response.json();
    }

    // Función para guardar datos del cliente
    function saveCustomerData(customerData) {
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
