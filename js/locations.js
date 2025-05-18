document.addEventListener('DOMContentLoaded', function () {
    const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');
    const restaurantSelection = document.getElementById('restaurantSelection');
    const deliveryAddressSection = document.getElementById('deliveryAddressSection');

    // Manejar cambio en el tipo de pedido
    orderTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'pickup') {
                restaurantSelection.style.display = 'block';
                deliveryAddressSection.style.display = 'none';
            } else {
                restaurantSelection.style.display = 'none';
                deliveryAddressSection.style.display = 'block';
            }
        });
    });

    // Guardar la selección en localStorage cuando se procede al pago
    document.querySelector('.checkout-btn').addEventListener('click', function (e) {
        e.preventDefault();

        const orderType = document.querySelector('input[name="orderType"]:checked').value;

        // Guardamos cada dato por separado en localStorage
        localStorage.setItem('orderType', orderType);

        if (orderType === 'pickup') {
            const restaurantSelect = document.getElementById('restaurantSelect');
            const selectedOption = restaurantSelect.options[restaurantSelect.selectedIndex];

            localStorage.setItem('restaurantId', restaurantSelect.value);
            localStorage.setItem('restaurantName', selectedOption.text);
            localStorage.setItem('location', selectedOption.text);

            // Limpiamos datos de delivery que no usaremos
            localStorage.removeItem('deliveryAddress');
        } else {
            const deliveryAddress = document.getElementById('deliveryAddress').value;
            const restaurantSelect = document.getElementById('restaurantSelect');

            localStorage.setItem('deliveryAddress', deliveryAddress);
            localStorage.setItem('restaurantId', restaurantSelect.value);
            localStorage.setItem('location', deliveryAddress);

            // Limpiamos datos de pickup que no usaremos
            localStorage.removeItem('restaurantName');
        }

        // Redirigir a la página de pago
        window.location.href = "../html/login.html";
    });
});