

document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del formulario
    const paymentForm = document.getElementById('payment-form');
    const payButton = document.getElementById('pay-button');
    
    // Mostrar el total del pedido
    const totalElement = document.getElementById('dynamic-text');
    const totalPrice = localStorage.getItem('totalPrice') || '0.00';
    totalElement.textContent = `${parseFloat(totalPrice).toFixed(2)} €`;

    // Validación en tiempo real del número de tarjeta
    const cardNumberInput = document.getElementById('card-number');
    const cardTypeIndicator = document.getElementById('card-type-indicator');
    
    cardNumberInput.addEventListener('input', function() {
        const cardNumber = this.value.replace(/\D/g, ''); // Solo números
        this.value = cardNumber; // Actualizar el valor sin caracteres no numéricos
        
        // Detectar tipo de tarjeta
        if (/^4/.test(cardNumber)) {
            cardTypeIndicator.textContent = 'VISA';
            document.getElementById('card-type').value = 'VISA';
        } else if (/^5[1-5]/.test(cardNumber)) {
            cardTypeIndicator.textContent = 'MASTERCARD';
            document.getElementById('card-type').value = 'MASTERCARD';
        } else if (/^3[47]/.test(cardNumber)) {
            cardTypeIndicator.textContent = 'AMEX';
            document.getElementById('card-type').value = 'AMEX';
        } else if (/^6(?:011|5)/.test(cardNumber)) {
            cardTypeIndicator.textContent = 'DISCOVER';
            document.getElementById('card-type').value = 'DISCOVER';
        } else {
            cardTypeIndicator.textContent = '';
        }
    });

    // Evento click del botón de pago
    payButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!paymentForm.checkValidity()) {
            paymentForm.reportValidity();
            return;
        }

        // Obtener datos del formulario
        const holderName = document.getElementById('holder-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const cardType = document.getElementById('card-type').value;
        const cvv = document.getElementById('cvv').value.trim();


    
        // Construir la URL para el POST
        const url = new URL('http://localhost:8080/CrazyCow_Server/Controller');
        url.searchParams.append('ACTION', 'ORDER.ADD');
        url.searchParams.append('customer_id', localStorage.getItem('customer_id') || '0');
        url.searchParams.append('restaurant_id', localStorage.getItem('restaurantId') || '0');
        url.searchParams.append('order_status', 'Preparation');
        url.searchParams.append('total', localStorage.getItem('totalPrice') || '0.00');
        url.searchParams.append('location', encodeURIComponent(localStorage.getItem('location') || ''));
        url.searchParams.append('order_details', localStorage.getItem('orderDetails'));
        url.searchParams.append('holder_name', encodeURIComponent(holderName));
        url.searchParams.append('holder_number', cardNumber);
        url.searchParams.append('cvv', cvv);
        url.searchParams.append('card_type', cardType);

        console.log('URL de pago:', url.toString());

        // Deshabilitar botón durante el procesamiento
        const originalText = payButton.textContent;
        payButton.disabled = true;
        payButton.textContent = 'Procesando...';

        try {
            // Hacer la petición GET (los parámetros van en la URL)
            const response = await fetch(url.toString());
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.text();
            
            if (result.includes('ERROR')) {
                throw new Error(result);
            }

            // Pago exitoso - limpiar carrito y redirigir
            localStorage.removeItem('burgerCart');
            localStorage.removeItem('totalPrice');
            window.location.href = '../html/payment-success.html';
            
        } catch (error) {
            console.error('Error en el pago:', error);
            alert(`Error al procesar el pago: ${error.message}`);
        } finally {
            // Restaurar botón
            payButton.disabled = false;
            payButton.textContent = originalText;
        }
    });
});
