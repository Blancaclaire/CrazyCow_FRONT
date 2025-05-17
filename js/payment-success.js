document.addEventListener('DOMContentLoaded', function() {
    // Check if we arrived from a successful payment
    const isPaymentSuccess = localStorage.getItem('orderConfirmation') === 'success';
    
    if (!isPaymentSuccess) {
        // Redirect back to cart if not coming from payment
        // Uncomment this if you want to enforce the redirect
        // window.location.href = '../html/shopping-cart.html';
        // return;
    }
    
    // Clear the confirmation flag
    localStorage.removeItem('orderConfirmation');
    
    // Display order details
    displayOrderDetails();
    
    // Configure event for the continue shopping button
    document.querySelector('.continue-shopping').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../html/products-menu.html';
    });
});

function displayOrderDetails() {
    const orderIdElement = document.getElementById('order-id');
    const paymentIdElement = document.getElementById('payment-id');
    const orderDateElement = document.getElementById('order-date');
    
    // Get order data from localStorage if available
    const orderData = JSON.parse(localStorage.getItem('orderData')) || {};
    
    // Display order ID or generate a random one
    if (orderData.orderId) {
        orderIdElement.textContent = orderData.orderId;
    } else {
        orderIdElement.textContent = 'ORD-' + generateRandomId(8);
    }
    
    // Display payment ID or generate a random one
    if (orderData.paymentId) {
        paymentIdElement.textContent = orderData.paymentId;
    } else {
        paymentIdElement.textContent = 'PAY-' + generateRandomId(8);
    }
    
    // Display current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    orderDateElement.textContent = today.toLocaleDateString('en-US', options);
    
    // Save order data for reference
    const newOrderData = {
        orderId: orderIdElement.textContent,
        paymentId: paymentIdElement.textContent,
        date: orderDateElement.textContent
    };
    localStorage.setItem('orderData', JSON.stringify(newOrderData));
    
    // Clear cart data
    localStorage.removeItem('cartItems');
    localStorage.removeItem('totalPrice');
}

// Helper function to generate random ID
function generateRandomId(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}