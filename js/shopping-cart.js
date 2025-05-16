// Configuración base
const API_BASE_URL = 'http://localhost:8080/CrazyCow_Server/Controller';
const PRODUCT_ACTION = 'ACTION=PRODUCT.FIND_ALL';

// Mapeo de categorías (ajusta según tu base de datos)
const CATEGORY_MAP = {
    'burgers': '1000',      // Hamburguesas
    'drinks': '1002',       // Bebidas
    'forBitting': '1001',   // Acompañamientos (forBitting)
    'desserts': '1003'      // Postres
};

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('burgerCart')) {
        localStorage.setItem('burgerCart', JSON.stringify([]));
    }
    
    updateBasketCount();
    
    // Si estamos en la página del carrito, renderizarlo
    if (window.location.href.includes('../html/shopping-cart.html')) {
        renderCart();
        
        // Event listeners específicos de la página del carrito
        document.querySelector('.empty-cart button')?.addEventListener('click', function() {
            window.location.href = '../html/products-menu.html';
        });
        
        document.getElementById('addProductsBtn')?.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../html/products-menu.html';
        });
    }
    
    // Si estamos en la página de productos, configurar los event listeners para añadir al carrito
    if (window.location.href.includes('../html/products-menu.html')) {
        // El event listener para 'add-to-cart' se configura en el script products.js
        // cuando se muestra el detalle del producto
    }
});

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
    
    // Si no estamos en la página de carrito, salir
    if (!cartContents || !emptyCartMessage) return;
    
    function formatPrice(price) {
        return '€' + price.toFixed(2);
    }
    
    function calculateTotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        subtotalAmount.textContent = formatPrice(subtotal);
        totalAmount.textContent = formatPrice(subtotal);
        return subtotal;
    }
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        addProductsSection.style.display = 'none';
        loadSuggestedProducts();
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    cartSummary.style.display = 'block';
    addProductsSection.style.display = 'block';
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
    setupEventListeners();
    loadSuggestedProducts();
}

// Configurar event listeners para la página del carrito
function setupEventListeners() {
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

// Cargar productos sugeridos en la página de carrito
function loadSuggestedProducts() {
    const suggestedProductsContainer = document.getElementById('suggestedProducts');
    if (!suggestedProductsContainer) return;
    
    suggestedProductsContainer.innerHTML = '<div class="suggested-products-grid"></div>';
    const gridContainer = suggestedProductsContainer.querySelector('.suggested-products-grid');
    
    // Seleccionar una categoría aleatoria (incluyendo forBitting)
    const categories = ['burgers', 'drinks', 'forBitting', 'desserts'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryId = CATEGORY_MAP[randomCategory] || '1000';
    
    fetch(`${API_BASE_URL}?${PRODUCT_ACTION}&category_id=${categoryId}`)
        .then(response => response.json())
        .then(products => {
            if (!products || products.length === 0) {
                gridContainer.innerHTML = '<p>No hay productos sugeridos disponibles</p>';
                return;
            }
            
            // Seleccionar 3 productos aleatorios
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            const selectedProducts = shuffled.slice(0, 3);
            
            // Mostrar productos
            selectedProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'suggested-product-card';
                
                productCard.innerHTML = `
                    <img src="${product.Producto_IMG}" alt="${product.Nombre}" class="suggested-product-image">
                    <div class="suggested-product-info">
                        <div class="suggested-product-name">${product.Nombre}</div>
                        <div class="suggested-product-price">€${product.Precio.toFixed(2)}</div>
                        <button class="add-to-cart" data-id="${product.ID_Producto}" data-type="${randomCategory}">Añadir</button>
                    </div>
                `;
                
                gridContainer.appendChild(productCard);
            });
            
            // Event listeners para botones "Añadir"
            gridContainer.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const productType = this.getAttribute('data-type');
                    
                    fetch(`${API_BASE_URL}?ACTION=PRODUCT.FIND_BY_ID&product_id=${productId}`)
                        .then(response => response.json())
                        .then(product => {
                            if (product) {
                                addToCart({
                                    id: product.ID_Producto,
                                    name: product.Nombre,
                                    price: product.Precio,
                                    image: product.Producto_IMG,
                                    description: product.Descripcion,
                                    type: productType
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error al obtener detalles del producto:', error);
                            showNotification('Error al añadir el producto');
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar productos sugeridos:', error);
            gridContainer.innerHTML = '<p>Error al cargar sugerencias</p>';
        });
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
    if (window.location.href.includes('../html/shopping-cart.html')) {
        renderCart();
    }
    
    showNotification(`${product.name} añadido al carrito!`);
}

// Función para vaciar el carrito
function clearCart() {
    localStorage.setItem('burgerCart', JSON.stringify([]));
    updateBasketCount();
    
    // Si estamos en la página de carrito, renderizarlo de nuevo
    if (window.location.href.includes('../html/shopping-cart.html')) {
        renderCart();
    }
    
    showNotification('Carrito vaciado');
}