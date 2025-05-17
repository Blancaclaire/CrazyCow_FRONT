// combined.js - Manejo de autenticación y carrito de compras para CrazyCow

document.addEventListener('DOMContentLoaded', function() {
    console.log("combined.js cargado");
    
    // Verificar si ya estamos logueados al cargar la página
    checkLoginStatus();
    
    // Toggle para mostrar/ocultar contraseña en página de login
    const mostrarBtn = document.querySelector('.password-toggle');
    const passInput = document.getElementById('password');
    
    if (mostrarBtn && passInput) {
        mostrarBtn.addEventListener('click', function() {
            passInput.type = passInput.type === 'password' ? 'text' : 'password';
        });
    }
    
    // Manejo del formulario de login
    const formulario = document.getElementById('loginForm');
    if (formulario) {
        console.log("Formulario de login encontrado, configurando event listener");
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Formulario enviado");
            
            const email = document.getElementById('usernameEmail').value.trim();
            const pass = document.getElementById('password').value;
            const mensaje = document.getElementById('loginMessage');
            
            // Validaciones
            if (!email || !pass) {
                mostrarError(mensaje, 'Ingresa email y contraseña');
                return;
            }
            
            if (!validarEmail(email)) {
                mostrarError(mensaje, 'Ingresa un email válido');
                return;
            }
            
            mostrarInfo(mensaje, 'Verificando...');
            console.log("Enviando datos al servidor...");
            
            // Envío de datos al servidor
            fetch('http://localhost:8080/CrazyCow_Server/Controller', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `ACTION=CUSTOMER.LOGIN&email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`
            })
            .then(res => {
                if (!res.ok) throw new Error('Error en la respuesta del servidor');
                return res.text();
            })
            .then(respuesta => {
                respuesta = respuesta.trim();
                console.log("Respuesta del servidor:", respuesta);
                
                if (respuesta === "OK" || respuesta.startsWith("OK")) {
                    // Login exitoso
                    mostrarExito(mensaje, '¡Bienvenido! Redirigiendo...');
                    
                    // Extraer datos del cliente si están disponibles en la respuesta
                    let customerId = '123'; // Valor predeterminado si no se puede extraer
                    if (respuesta.includes('|')) {
                        const dataParts = respuesta.split('|');
                        if (dataParts.length >= 2) {
                            customerId = dataParts[1];
                        }
                    }
                    
                    handleSuccessfulLogin(email, customerId);
                } else if (respuesta === "NO") {
                    mostrarError(mensaje, 'Credenciales incorrectas');
                } else {
                    mostrarError(mensaje, 'Error inesperado');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError(mensaje, 'Error de conexión');
            });
        });
    }
    
    // Configuración de botones y eventos para el carrito de compras
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        console.log("Botón de checkout encontrado, configurando evento");
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prepareCheckout();
        });
    }
    
    // Comprobar en qué página estamos y ejecutar la lógica correspondiente
    const currentPage = window.location.pathname;
    console.log("Página actual:", currentPage);
    
    // Si estamos en la página de pago
    if (currentPage.includes('payment.html')) {
        console.log("Detectada página de pago");
        initPaymentPage();
    }
});

// FUNCIONES DE AUTENTICACIÓN

// Función para manejar un login exitoso
function handleSuccessfulLogin(email, customerId) {
    console.log("Login exitoso, procesando...");
    
    // Guardar datos básicos del usuario con fecha de expiración
    const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
    
    const userData = {
        email: email,
        customerId: customerId,
        token: Date.now().toString(),
        expires: expirationTime
    };
    
    // Guardar como objeto serializado para mayor robustez
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Guardar también como valores individuales para compatibilidad con código existente
    localStorage.setItem('userEmail', email);
    localStorage.setItem('customerId', customerId);
    localStorage.setItem('userToken', userData.token);
    
    console.log("Datos de usuario guardados:", userData);
    
    // Determinar hacia dónde redirigir después del login
    let redirectTo = localStorage.getItem('redirectAfterLogin');
    console.log("Redirección definida:", redirectTo);
    
    // Si se va a la página de pago, preparar datos necesarios
    if (!redirectTo) {
        // Si no hay redirección definida, intentamos ir a payment.html si hay productos en el carrito
        if (checkCartItems()) {
            redirectTo = 'payment.html';
            console.log("No hay redirección definida, pero hay items en el carrito, redirigiendo a payment.html");
        } else {
            redirectTo = 'index.html';
            console.log("No hay redirección definida ni productos en el carrito, redirigiendo a index.html");
        }
    }
    
    // Si el destino es la página de pago, asegurarse que tenemos datos del carrito
    if (redirectTo.includes('payment.html')) {
        if (!checkCartItems()) {
            console.log("Redirección a payment.html pero no hay items en el carrito, redirigiendo a shopping-cart.html");
            window.location.href = 'shopping-cart.html';
            return;
        }
        
        // Guardar datos necesarios para el pago
        saveUserDataForPayment();
    }
    
    console.log(`Redirigiendo a ${redirectTo} en 1.5 segundos...`);
    
    // Redirigir al usuario
    setTimeout(() => {
        window.location.href = redirectTo;
        localStorage.removeItem('redirectAfterLogin'); // Limpiar después de usar
    }, 1500);
}

// Verificar el estado del login
function checkLoginStatus() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentTime = Date.now();
        
        // Verificar si hay datos y si no han expirado
        if (userData.email && userData.token && userData.expires > currentTime) {
            console.log("Usuario ya logueado:", userData.email);
            return true;
        } else {
            console.log("No hay sesión activa o ha expirado");
            // Limpiar datos expirados
            if (userData.expires && userData.expires <= currentTime) {
                console.log("Limpiando sesión expirada");
                localStorage.removeItem('userData');
                localStorage.removeItem('isLoggedIn');
            }
            return false;
        }
    } catch (e) {
        console.error("Error al verificar estado de login:", e);
        return false;
    }
}

// Función para verificar el estado del login cuando se accede a páginas protegidas
function checkUserLoginStatus() {
    console.log("Verificando estado de login...");
    
    try {
        // Verificar datos estructurados primero
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentTime = Date.now();
        
        // Si hay datos estructurados y no han expirado
        if (userData.email && userData.token && userData.expires > currentTime) {
            console.log("Sesión activa para:", userData.email);
            return true;
        }
        
        // Verificación alternativa por retrocompatibilidad
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const customerId = localStorage.getItem('customerId');
        const userToken = localStorage.getItem('userToken');
        
        // Si tenemos al menos un token y un ID de cliente
        if (isLoggedIn && customerId && userToken) {
            console.log("Sesión activa (método alternativo)");
            return true;
        }
        
        console.log("No hay sesión activa");
        return false;
    } catch (error) {
        console.error("Error al verificar estado de login:", error);
        return false;
    }
}

// Función para redirigir al login si no está autenticado
function redirectToLoginIfNeeded() {
    if (!checkUserLoginStatus()) {
        console.log("Usuario no autenticado, redirigiendo a login...");
        // Guardar la URL actual para redirigir después del login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = 'login.html';
        return true; // Se produjo redirección
    }
    return false; // No se requirió redirección
}

// FUNCIONES DEL CARRITO Y PAGO

// Verificar si hay elementos en el carrito
function checkCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const burgerCart = JSON.parse(localStorage.getItem('burgerCart') || '[]');
    
    const hasItems = cartItems.length > 0 || burgerCart.length > 0;
    console.log("Verificando items en carrito:", hasItems);
    return hasItems;
}

// Función para procesar el checkout
function prepareCheckout() {
    console.log("Preparando checkout...");
    const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de proceder al pago.');
        return;
    }
    
    // Calcular el total
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Guardar datos necesarios para el pago
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Guardar la URL de destino después del login
    localStorage.setItem('redirectAfterLogin', 'payment.html');
    
    // Verificar si el usuario ya está logueado
    const isLoggedIn = checkUserLoginStatus();
    
    if (isLoggedIn) {
        // Si ya está logueado, guardar datos y redirigir directamente al pago
        saveUserDataForPayment();
        window.location.href = 'payment.html';
    } else {
        // Si no está logueado, redirigir al login
        window.location.href = 'login.html';
    }
}

// Guardar datos del cliente necesarios para el pago
function saveUserDataForPayment() {
    console.log("Guardando datos para pago...");
    
    // Obtener datos del cliente desde localStorage
    let customerId, userEmail;
    
    try {
        // Intentar obtener desde datos estructurados primero
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.customerId) {
            customerId = userData.customerId;
            userEmail = userData.email;
        }
    } catch (e) {
        console.error("Error al leer datos de usuario:", e);
    }
    
    // Si no se encontraron en el formato estructurado, buscar en el formato antiguo
    if (!customerId) {
        customerId = localStorage.getItem('customerId') || '0';
    }
    
    if (!userEmail) {
        userEmail = localStorage.getItem('userEmail') || '';
    }
    
    const restaurantId = localStorage.getItem('restaurantId') || '1';  // Default a 1 si no existe
    const deliveryLocation = localStorage.getItem('deliveryLocation') || '';
    
    // Guardar en localStorage para que estén disponibles en la página de pago
    localStorage.setItem('customerId', customerId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('restaurantId', restaurantId);
    localStorage.setItem('deliveryLocation', deliveryLocation);
    
    console.log("Datos guardados para pago:", { customerId, userEmail, restaurantId, deliveryLocation });
    
    // Si no hay datos de carrito, prepararlos desde burgerCart
    if (!localStorage.getItem('cartItems')) {
        const burgerCart = JSON.parse(localStorage.getItem('burgerCart') || '[]');
        if (burgerCart.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(burgerCart));
            
            // Calcular el total
            const totalPrice = burgerCart.reduce((total, item) => total + (item.price * item.quantity), 0);
            localStorage.setItem('totalPrice', totalPrice.toFixed(2));
            console.log("Carrito preparado para pago, total:", totalPrice.toFixed(2));
        }
    }
}

// Inicializar la página de pago
function initPaymentPage() {
    console.log("Inicializando página de pago...");
    
    // Redirigir al login si no está autenticado
    if (redirectToLoginIfNeeded()) {
        return; // No continuar si se redirigió
    }
    
    // Verificar si hay datos de compra
    if (!localStorage.getItem('totalPrice') || !localStorage.getItem('cartItems')) {
        console.error("No hay información de compra.");
        alert('No hay información de compra. Por favor, regresa al carrito.');
        window.location.href = 'shopping-cart.html';
        return;
    }

    // Obtener datos del localStorage
    const totalPrice = localStorage.getItem('totalPrice') || '0.00';
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const customerId = localStorage.getItem('customerId') || '0';
    const restaurantId = localStorage.getItem('restaurantId') || '1';
    const location = localStorage.getItem('deliveryLocation') || '';
    
    console.log("Datos de pago cargados:", { totalPrice, customerId, restaurantId });
    
    // Actualizar el precio total mostrado
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        dynamicText.textContent = `${parseFloat(totalPrice).toFixed(2)}`;
        console.log("Total actualizado en la interfaz:", totalPrice);
    } else {
        console.error("Elemento dynamic-text no encontrado");
    }
    
    // Configurar elementos del formulario de pago
    if (typeof setupPaymentForm === 'function') {
        setupPaymentForm();
    } else {
        console.log("Función setupPaymentForm no disponible");
    }
}

// FUNCIONES UTILITARIAS

// Validar formato de email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Funciones para mostrar mensajes al usuario
function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.className = 'error-message';
    console.log("Error mostrado:", mensaje);
}

function mostrarExito(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.className = 'success-message';
    console.log("Éxito mostrado:", mensaje);
}

function mostrarInfo(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.className = 'info-message';
    console.log("Info mostrada:", mensaje);
}