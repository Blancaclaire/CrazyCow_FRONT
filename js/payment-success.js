// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si llegamos desde un pago exitoso
    const isPaymentSuccess = localStorage.getItem('orderConfirmation') === 'success';
    
    if (!isPaymentSuccess) {
    }
    
    // Limpiar la bandera de confirmación
    localStorage.removeItem('orderConfirmation');
    
    // Mostrar los detalles del pedido
    displayOrderDetails();
    
    // Configurar evento para el botón de continuar comprando
    document.querySelector('.continue-shopping').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../html/products-menu.html';
    });
});

// Función para mostrar los detalles del pedido
function displayOrderDetails() {
    const orderIdElement = document.getElementById('order-id');
    const paymentIdElement = document.getElementById('payment-id');
    const orderDateElement = document.getElementById('order-date');
    
    // Obtener datos del pedido de localStorage si están disponibles
    const orderData = JSON.parse(localStorage.getItem('orderData')) || {};
    
    // Mostrar ID del pedido o generar uno aleatorio
    if (orderData.orderId) {
        orderIdElement.textContent = orderData.orderId;
    } else {
        orderIdElement.textContent = 'ORD-' + generateRandomId(8);
    }
    
    // Mostrar ID del pago o generar uno aleatorio
    if (orderData.paymentId) {
        paymentIdElement.textContent = orderData.paymentId;
    } else {
        paymentIdElement.textContent = 'PAY-' + generateRandomId(8);
    }
    
    // Mostrar fecha actual
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    orderDateElement.textContent = today.toLocaleDateString('en-US', options);
    
    // Guardar datos del pedido para referencia futura
    const newOrderData = {
        orderId: orderIdElement.textContent,
        paymentId: paymentIdElement.textContent,
        date: orderDateElement.textContent
    };
    localStorage.setItem('orderData', JSON.stringify(newOrderData));
    
    // Limpiar datos del carrito
    localStorage.removeItem('cartItems');
    localStorage.removeItem('totalPrice');
}

// Función auxiliar para generar ID aleatorio
function generateRandomId(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}