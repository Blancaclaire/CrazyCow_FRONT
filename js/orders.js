document.addEventListener('DOMContentLoaded', function() {
    console.log("Orders page initialized");
    initializeOrdersPage();
});

function initializeOrdersPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurant_id');
    
    if (restaurantId) {
        console.log("Restaurant ID:", restaurantId);
        fetchOrdersByRestaurant(restaurantId);
    } else {
        showError("No restaurant_id provided in URL");
    }
}

function fetchOrdersByRestaurant(restaurantId) {
    const ordersContainer = document.getElementById('orders-container');
    if (ordersContainer) {
        ordersContainer.innerHTML = '<p class="loading">Loading orders...</p>';
    }

    const apiUrl = `http://localhost:8080/api/Controller?ACTION=ORDER.FIND_ALL&restaurant_id=${restaurantId}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(orders => {
            console.log("Orders received:", orders);
            displayOrders(orders);
        })
        .catch(error => {
            console.error("Error fetching orders:", error);
            showError(`Error loading orders: ${error.message}`);
        });
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    if (!ordersContainer) return;

    ordersContainer.innerHTML = '';

    if (!orders || orders.length === 0) {
        ordersContainer.innerHTML = '<p class="no-orders">No orders found</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        orderCard.innerHTML = `
            <div class="order-header">
                <h3>Order #${order.order_id}</h3>
                <span class="status ${order.order_status.toLowerCase()}">${order.order_status}</span>
            </div>
            <div class="order-body">
                <p><strong>Date:</strong> ${formatDate(order.order_date)}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <p><strong>Location:</strong> ${order.location}</p>
                
                <h4>Order Details:</h4>
                <ul class="order-details">
                    ${order.order_details.map(detail => `
                        <li>
                            Product ID: ${detail.product_id} - 
                            Quantity: ${detail.quantity}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
}

function showError(message) {
    const container = document.querySelector('.container') || document.body;
    container.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <a href="../html/employee-details.html" class="bt-back">Return to profile</a>
        </div>
    `;
}
