// Configuración base
const API_BASE_URL = 'http://localhost:8080/CrazyCow_Server/Controller';

// Mapeo de categorías
const CATEGORY_MAP = {
    'burgers': '1000',      // Hamburguesas
    'drinks': '1002',       // Bebidas
    'forBitting': '1001',   // Acompañamientos (forBitting)
    'desserts': '1003'      // Postres
};

// Función que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicialización del carrito si no existe
    if (!localStorage.getItem('burgerCart')) {
        localStorage.setItem('burgerCart', JSON.stringify([]));
    }
    
    // Actualizar contador del carrito en la interfaz
    updateBasketCount();
    
    // Comprobar en qué página estamos y ejecutar la lógica correspondiente
    const currentPage = window.location.pathname;
    
    // Si estamos en la página del carrito
    if (currentPage.includes('shopping-cart.html')) {
        console.log("Inicializando página de carrito");
        renderCart();
        
        // Event listeners para la página del carrito
        document.querySelector('.empty-cart button')?.addEventListener('click', function() {
            window.location.href = '../html/products-menu.html';
        });
        
        document.getElementById('addProductsBtn')?.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../html/products-menu.html';
        });
        
        // Configurar el botón de checkout
        document.querySelector('.checkout-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            prepareCheckout();
        });
    } 
    // Si estamos en la página de pago
    else if (currentPage.includes('payment.html')) {
        console.log("Inicializando página de pago");
        initPaymentPage();
    }
});

// Función para preparar el checkout y redirigir a la página de login
function prepareCheckout() {
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
    localStorage.setItem('redirectAfterLogin', '../html/payment.html');
    
    // Verificar si el usuario ya está logueado
    const isLoggedIn = checkUserLoginStatus();
    
    if (isLoggedIn) {
        // Si ya está logueado, guardar datos y redirigir directamente al pago
        saveUserDataForPayment();
        window.location.href = '../html/payment.html';
    } else {
        // Si no está logueado, redirigir al login
        window.location.href = '../html/login.html';
    }
}

// Función para verificar el estado de login del usuario
function checkUserLoginStatus() {
    // Verificar si el usuario tiene un token de sesión o ID de cliente válido
    const customerId = localStorage.getItem('customerId');
    const userToken = localStorage.getItem('userToken');
    
    // Aquí puedes agregar cualquier lógica adicional para validar la sesión
    // Por ejemplo, verificar si el token no ha expirado
    
    return customerId && customerId !== '0' && userToken;
}

// Guardar datos del cliente necesarios para el pago
function saveUserDataForPayment() {
    // Obtener datos del cliente desde localStorage o sessionStorage
    const customerId = localStorage.getItem('customerId') || '0';
    const restaurantId = localStorage.getItem('restaurantId') || '0';
    const deliveryLocation = localStorage.getItem('deliveryLocation') || '';
    
    // Guardar en localStorage para que estén disponibles en la página de pago
    localStorage.setItem('customerId', customerId);
    localStorage.setItem('restaurantId', restaurantId);
    localStorage.setItem('deliveryLocation', deliveryLocation);
}

// Inicializar la página de pago
function initPaymentPage() {
    // Verificar si el usuario está logueado
    if (!checkUserLoginStatus()) {
        alert('Debes iniciar sesión para proceder al pago');
        window.location.href = '../html/login.html';
        return;
    }
    
    // Verificar si hay datos de compra
    if (!localStorage.getItem('totalPrice') || !localStorage.getItem('cartItems')) {
        alert('No hay información de compra. Por favor, regresa al carrito.');
        window.location.href = '../html/shopping-cart.html';
        return;
    }

    // Obtener datos del localStorage
    const totalPrice = localStorage.getItem('totalPrice') || '0.00';
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const customerId = localStorage.getItem('customerId') || '0';
    const restaurantId = localStorage.getItem('restaurantId') || '0';
    const location = localStorage.getItem('deliveryLocation') || '';
    
    // Actualizar el precio total mostrado
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        dynamicText.textContent = `${parseFloat(totalPrice).toFixed(2)}`;
    }
    
    // Configurar elementos del formulario de pago
    setupPaymentForm();
}

// Configurar formulario de pago
function setupPaymentForm() {
    const cardNumberInput = document.getElementById('card-number');
    const cardTypeSelect = document.getElementById('card-type');
    const cvvInput = document.getElementById('cvv');
    const payButton = document.getElementById('pay-button');
    
    if (!cardNumberInput || !cardTypeSelect || !cvvInput || !payButton) return;
    
    // Detección automática del tipo de tarjeta
    cardNumberInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        
        if (this.value.length > 16) {
            this.value = this.value.slice(0, 16);
        }
        
        const cardNumber = this.value;
        if (cardNumber.startsWith('4')) {
            cardTypeSelect.value = "VISA";
        } else if (cardNumber.startsWith('5')) {
            cardTypeSelect.value = "MASTERCARD";
        } else if (cardNumber.startsWith('3')) {
            cardTypeSelect.value = "AMEX";
        } else if (cardNumber.startsWith('6')) {
            cardTypeSelect.value = "DISCOVER";
        } else if (cardNumber.length > 0) {
            cardTypeSelect.value = "OTHER";
        }
    });
    
    // Validación CVV
    cvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        
        const cardType = cardTypeSelect.value;
        const maxLength = (cardType === "AMEX") ? 4 : 3;
        
        if (this.value.length > maxLength) {
            this.value = this.value.slice(0, maxLength);
        }
    });
    
    // Actualizar longitud máxima del CVV cuando cambia el tipo de tarjeta
    cardTypeSelect.addEventListener('change', function() {
        const cardType = this.value;
        const cvvMaxLength = (cardType === "AMEX") ? 4 : 3;
        cvvInput.setAttribute('maxlength', cvvMaxLength);
        
        if (cvvInput.value.length > cvvMaxLength) {
            cvvInput.value = cvvInput.value.slice(0, cvvMaxLength);
        }
    });
    
    // Manejar el envío del pago
    payButton.addEventListener('click', function(e) {
        e.preventDefault();
        processPayment();
    });
}

// Procesar el pago
function processPayment() {
    // Elementos del formulario
    const holderName = document.getElementById('holder-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const cardType = document.getElementById('card-type').value;
    const cvv = document.getElementById('cvv').value.trim();
    const payButton = document.getElementById('pay-button');
    
    // Validar formulario
    let isValid = validatePaymentForm(holderName, cardNumber, cardType, cvv);
    
    if (!isValid) return;
    
    // Obtener datos necesarios para el pedido
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalPrice = localStorage.getItem('totalPrice') || '0.00';
    const customerId = localStorage.getItem('customerId') || '0';
    const restaurantId = localStorage.getItem('restaurantId') || '0';
    const location = localStorage.getItem('deliveryLocation') || '';
    
    // Preparar detalles del pedido
    let orderDetailsString = cartItems.map(item => `${item.id}:${item.quantity}`).join(',');
    
    // Mostrar estado de procesamiento
    const originalButtonText = payButton.textContent;
    payButton.textContent = "Procesando...";
    payButton.disabled = true;
    
    // Crear URL para la API
    const url = new URL('/CrazyCow_Server/Controller', window.location.origin);
    url.searchParams.append('ACTION', 'ORDER.ADD');
    url.searchParams.append('customer_id', customerId);
    url.searchParams.append('restaurant_id', restaurantId);
    url.searchParams.append('order_status', 'Preparation');
    url.searchParams.append('total', totalPrice);
    url.searchParams.append('location', location);
    url.searchParams.append('order_details', orderDetailsString);
    url.searchParams.append('holder_name', holderName);
    url.searchParams.append('holder_number', cardNumber);
    url.searchParams.append('cvv', cvv);
    url.searchParams.append('card_type', cardType);
    
    // Enviar pedido al servidor
    fetch(url, { method: 'GET' })
    .then(response => {
        if (!response.ok) throw new Error('Error en el procesamiento del pago');
        return response.text();
    })
    .then(data => {
        if (data.includes('ERROR')) throw new Error(data);
        
        // Limpiar carrito después de una compra exitosa
        localStorage.removeItem('burgerCart');
        localStorage.removeItem('totalPrice');
        localStorage.removeItem('cartItems');
        
        // Guardar confirmación y redirigir
        localStorage.setItem('orderConfirmation', 'success');
        window.location.href = '../html/payment-success.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en el pago: ' + error.message);
    })
    .finally(() => {
        payButton.textContent = originalButtonText;
        payButton.disabled = false;
    });
}

// Validar formulario de pago
function validatePaymentForm(holderName, cardNumber, cardType, cvv) {
    let isValid = true;
    
    if (!holderName) {
        document.getElementById('name-error').textContent = 'Por favor ingrese el nombre del titular';
        document.getElementById('name-error').classList.add('visible');
        isValid = false;
    } else {
        document.getElementById('name-error').classList.remove('visible');
    }
    
    if (!cardNumber || cardNumber.length < 13) {
        document.getElementById('number-error').textContent = 'Por favor ingrese un número de tarjeta válido';
        document.getElementById('number-error').classList.add('visible');
        isValid = false;
    } else {
        document.getElementById('number-error').classList.remove('visible');
    }
    
    if (!cardType) {
        document.getElementById('card-type-error').textContent = 'Por favor seleccione un tipo de tarjeta';
        document.getElementById('card-type-error').classList.add('visible');
        isValid = false;
    } else {
        document.getElementById('card-type-error').classList.remove('visible');
    }
    
    const expectedCvvLength = (cardType === "AMEX") ? 4 : 3;
    if (!cvv || cvv.length !== expectedCvvLength) {
        document.getElementById('cvv-error').textContent = `Por favor ingrese un CVV válido de ${expectedCvvLength} dígitos`;
        document.getElementById('cvv-error').classList.add('visible');
        isValid = false;
    } else {
        document.getElementById('cvv-error').classList.remove('visible');
    }
    
    return isValid;
}

// Actualizar contador del carrito
function updateBasketCount() {
    const basketCount = document.getElementById('basketCount');
    if (basketCount) {
        const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        basketCount.textContent = totalItems;
    }
}

// Mostrar notificación
function showNotification(message) {
    // Buscar el mensaje existente o crear uno nuevo
    let notification = document.getElementById('addToCartMessage');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'addToCartMessage';
        notification.className = 'add-to-cart-message';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Renderizar el carrito (solo se usa en la página de carrito)
function renderCart() {
    let cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    const cartContents = document.getElementById('cartContents');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSummary = document.getElementById('cartSummary');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    const addProductsSection = document.getElementById('addProductsSection');
    
    // Si no estamos en la página de carrito o no encontramos los elementos, salir
    if (!cartContents || !emptyCartMessage) return;
    
    function formatPrice(price) {
        return '$' + price.toFixed(2);
    }
    
    function calculateTotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        if (subtotalAmount) subtotalAmount.textContent = formatPrice(subtotal);
        if (totalAmount) totalAmount.textContent = formatPrice(subtotal);
        return subtotal;
    }
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        if (addProductsSection) addProductsSection.style.display = 'none';
        // Cargar productos sugeridos si existe la función
        if (typeof loadSuggestedProducts === 'function') {
            loadSuggestedProducts();
        }
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    if (addProductsSection) addProductsSection.style.display = 'block';
    cartContents.innerHTML = '';
    
    // Agrupar por categorías específicas
    const groupedItems = {
        'burgers': [],
        'desserts': [],
        'drinks': [],
        'forBitting': []
    };
    
    cart.forEach((item, index) => {
        item.originalIndex = index;
        if (groupedItems[item.type]) {
            groupedItems[item.type].push(item);
        } else {
            // Si no coincide con ninguna categoría, lo ponemos en forBitting
            groupedItems['forBitting'].push(item);
        }
    });
    
    // Renderizar cada categoría
    Object.keys(groupedItems).forEach(category => {
        const items = groupedItems[category];
        if (items.length === 0) return;
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        
        // Nombres amigables para las categorías
        const categoryNames = {
            'burgers': 'Hamburguesas',
            'desserts': 'Postres',
            'drinks': 'Bebidas',
            'forBitting': 'Acompañamientos'
        };
        
        categoryHeader.textContent = categoryNames[category] || category;
        cartContents.appendChild(categoryHeader);
        
        // Renderizar cada producto
        items.forEach(item => {
            const menuCard = document.createElement('div');
            menuCard.className = 'menu-card';
            
            menuCard.innerHTML = `
                <div class="menu-title">${item.name}</div>
                <div class="menu-items">
                    <div class="menu-item">${item.description || ''}</div>
                </div>
                <div class="menu-controls">
                    <div class="menu-total">${formatPrice(item.price * item.quantity)}</div>
                    <div class="remove-control">
                        <button class="remove-btn" data-index="${item.originalIndex}">Eliminar</button>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" data-index="${item.originalIndex}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${item.originalIndex}">+</button>
                    </div>
                </div>
            `;
            
            cartContents.appendChild(menuCard);
        });
    });
    
    calculateTotal();
    setupCartEventListeners();
    
    // Cargar productos sugeridos si existe la función
    if (typeof loadSuggestedProducts === 'function') {
        loadSuggestedProducts();
    }
}

// Configurar event listeners para la página del carrito
function setupCartEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeItem(index);
        });
    });
    
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            decreaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            increaseQuantity(index);
        });
    });
}

// Funciones para manipulación del carrito
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('burgerCart', JSON.stringify(cart));
    renderCart();
    updateBasketCount();
}

function decreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('burgerCart', JSON.stringify(cart));
        renderCart();
        updateBasketCount();
    } else {
        removeItem(index);
    }
}

function increaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    cart[index].quantity++;
    localStorage.setItem('burgerCart', JSON.stringify(cart));
    renderCart();
    updateBasketCount();
}

// Función para añadir al carrito (usada tanto en la página de productos como en la de carrito)
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    
    const existingProductIndex = cart.findIndex(item => 
        item.id === product.id && item.type === product.type
    );
    
    if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1,
            type: product.type
        });
    }
    
    localStorage.setItem('burgerCart', JSON.stringify(cart));
    updateBasketCount();
    
    // Si estamos en la página de carrito, renderizarlo de nuevo
    if (window.location.href.includes('shopping-cart.html')) {
        renderCart();
    }
    
    showNotification(`${product.name} añadido al carrito!`);
}

// Función para vaciar el carrito
function clearCart() {
    localStorage.setItem('burgerCart', JSON.stringify([]));
    updateBasketCount();
    
    // Si estamos en la página de carrito, renderizarlo de nuevo
    if (window.location.href.includes('shopping-cart.html')) {
        renderCart();
    }
    
    showNotification('Carrito vaciado');
}


















