// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    if (!localStorage.getItem('burgerCart')) {
        localStorage.setItem('burgerCart', JSON.stringify([]));
    }
    
    updateBasketCount();
    
    // Load products if on product page
    if (document.querySelector('.products-container')) {
        loadProductsFromAPI();
    }
    
    // Add event listeners for cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.getAttribute('data-id'));
            const productType = productCard.getAttribute('data-type');
            
            fetchProductDetails(productId, productType);
        }
        
        if (e.target.classList.contains('add-menu-btn')) {
            const menuId = e.target.getAttribute('data-menu-id');
            addMenuToCart(menuId);
        }
    });
});

// Update basket counter
function updateBasketCount() {
    const basketCount = document.getElementById('basketCount');
    if (basketCount) {
        const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        basketCount.textContent = totalItems;
    }
}

// Load products from API
function loadProductsFromAPI() {
    const productsContainer = document.querySelector('.products-container');
    const productType = productsContainer.getAttribute('data-product-type');
    
    // Adjust endpoint for "forBitting" which is called "forBiting" in the API
    const endpoint = productType === 'forBitting' ? 'forBiting' : productType;
    
    fetch(`http://localhost:3000/${endpoint}`)
        .then(response => response.json())
        .then(products => {
            productsContainer.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-id', product.id);
                productCard.setAttribute('data-type', productType);
                
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <p class="product-price">$${product.price.toFixed(2).replace('.', ',')}</p>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                `;
                
                productsContainer.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error(`Error loading ${productType}:`, error);
            productsContainer.innerHTML = `<p>Failed to load ${productType}. Please try again later.</p>`;
        });
}

// Fetch product details
function fetchProductDetails(productId, productType) {
    // Adjust endpoint for "forBitting" which is called "forBiting" in the API
    const endpoint = productType === 'forBitting' ? 'forBiting' : productType;
    
    fetch(`http://localhost:3000/${endpoint}`)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                addProductToCart(product, productType);
            }
        })
        .catch(error => {
            console.error(`Error fetching ${productType} details:`, error);
            alert('Failed to add product to cart. Please try again.');
        });
}

// Add product to cart
function addProductToCart(product, productType) {
    const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    
    const existingProductIndex = cart.findIndex(item => 
        item.id === product.id && item.type === productType
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
            type: productType
        });
    }
    
    localStorage.setItem('burgerCart', JSON.stringify(cart));
    updateBasketCount();
    showNotification(`${product.name} added to cart!`);
}

// Add menu to cart
function addMenuToCart(menuId) {
    const cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    const menuDetails = getMenuDetails(menuId);
    
    if (menuDetails) {
        const existingMenuIndex = cart.findIndex(item => 
            item.id === menuDetails.id && item.type === 'menu'
        );
        
        if (existingMenuIndex >= 0) {
            cart[existingMenuIndex].quantity++;
        } else {
            cart.push({
                id: menuDetails.id,
                title: menuDetails.title,
                items: menuDetails.items,
                price: menuDetails.price,
                quantity: 1,
                type: 'menu'
            });
        }
        
        localStorage.setItem('burgerCart', JSON.stringify(cart));
        updateBasketCount();
        showNotification(`${menuDetails.title} added to cart!`);
    }
}

// Get menu details
function getMenuDetails(menuId) {
    const menus = {
        'golden': {
            id: 'golden',
            title: 'MENU PACA GOLDEN',
            items: ['Burger (2 meals)', 'Fries potatoes', 'Coke'],
            price: 12.30
        },
        'bbq': {
            id: 'bbq',
            title: 'MENU PACA BBQ',
            items: ['Paca BBQ Burger', 'Onion Rings', 'Draft Beer'],
            price: 14.50
        },
        'veggie': {
            id: 'veggie',
            title: 'MENU VEGGIE PACA',
            items: ['Veggie Paca Burger', 'Specialty Fries', 'Green Smoothie'],
            price: 13.99
        }
    };
    
    return menus[menuId];
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.opacity = '0';
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Shopping cart functionality
document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('burgerCart')) || [];
    const cartContents = document.getElementById('cartContents');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSummary = document.getElementById('cartSummary');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    const addProductsSection = document.getElementById('addProductsSection');
    const suggestedProducts = document.getElementById('suggestedProducts');
    
    function formatPrice(price) {
        return price.toFixed(2).replace('.', ',') + '€';
    }
    
    function calculateTotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        subtotalAmount.textContent = formatPrice(subtotal);
        totalAmount.textContent = formatPrice(subtotal);
        return subtotal;
    }
    
    function renderCart() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            addProductsSection.style.display = 'none';
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';
        addProductsSection.style.display = 'block';
        cartContents.innerHTML = '';
        
        // Group cart items by type for better organization
        const groupedItems = {
            'burgers': [],
            'desserts': [],
            'drinks': [],
            'forBiting': [],
            'menu': [],
            'other': []
        };
        
        cart.forEach((item, index) => {
            // Add the original index to the item for reference
            item.originalIndex = index;
            
            // Group items by their type
            if (groupedItems[item.type]) {
                groupedItems[item.type].push(item);
            } else {
                groupedItems['other'].push(item);
            }
        });
        
        // Render each product category with a header
        Object.keys(groupedItems).forEach(category => {
            const items = groupedItems[category];
            if (items.length === 0) return;
            
            // Create a category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            
            // Format the category name for display
            let displayCategory;
            switch (category) {
                case 'burgers':
                    displayCategory = 'Burgers';
                    break;
                case 'desserts':
                    displayCategory = 'Desserts';
                    break;
                case 'drinks':
                    displayCategory = 'Drinks';
                    break;
                case 'forBiting':
                    displayCategory = 'Appetizers';
                    break;
                case 'menu':
                    displayCategory = 'Menus';
                    break;
                default:
            }
            
            categoryHeader.textContent = displayCategory;
            cartContents.appendChild(categoryHeader);
            
            // Render each item in the category
            items.forEach(item => {
                const menuCard = document.createElement('div');
                menuCard.className = 'menu-card';
                
                let menuItems = '';
                if (item.type === 'menu' && Array.isArray(item.items)) {
                    item.items.forEach(menuItem => {
                        menuItems += `<ul class="menu-item">${menuItem}</ul>`;
                    });
                } else {
                    menuItems = `<ul class="menu-item">${item.name}</ul>`;
                    if (item.description) {
                        menuItems += `<ul class="menu-item-description">${item.description}</ul>`;
                    }
                }
                
                menuCard.innerHTML = `
                    <div class="menu-title">${item.title || item.name}</div>
                    <ul class="menu-items">
                        ${menuItems}
                    </ul>
                    <div class="menu-controls">
                        <div class="menu-total">TOTAL: ${formatPrice(item.price * item.quantity)}</div>
                        <div class="remove-control">
                            <button class="remove-btn" data-index="${item.originalIndex}">REMOVE</button>
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
    }
    
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
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateBasketCount();
    }
    
    function decreaseQuantity(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            saveCart();
            renderCart();
            updateBasketCount();
        } else {
            removeItem(index);
        }
    }
    
    function increaseQuantity(index) {
        cart[index].quantity++;
        saveCart();
        renderCart();
        updateBasketCount();
    }
    
    function saveCart() {
        localStorage.setItem('burgerCart', JSON.stringify(cart));
    }
    
    // Load 3 random suggested products from all categories
    function loadSuggestedProducts() {
        const suggestedProductsContainer = document.getElementById('suggestedProducts');
        suggestedProductsContainer.innerHTML = '<div class="suggested-products-grid"></div>';
        const gridContainer = suggestedProductsContainer.querySelector('.suggested-products-grid');
        
        // Fetch all product categories
        const productCategories = ['burgers', 'desserts', 'drinks', 'forBiting'];
        let allProducts = [];
        
        // Fetch all products from all categories
        const fetchPromises = productCategories.map(category => {
            const endpoint = category === 'forBitting' ? 'forBiting' : category;
            return fetch(`http://localhost:3000/${endpoint}`)
                .then(response => response.json())
                .then(products => {
                    // Add category info to each product
                    products.forEach(product => {
                        product.category = category;
                    });
                    allProducts = allProducts.concat(products);
                });
        });
        
        // When all products are loaded
        Promise.all(fetchPromises)
            .then(() => {
                // Select 3 random products
                const randomProducts = getRandomProducts(allProducts, 3);
                
                // Display them
                randomProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'suggested-product-card';
                    
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="suggested-product-image">
                        <div class="suggested-product-info">
                            <div class="suggested-product-name">${product.name}</div>
                            <div class="suggested-product-price">${formatPrice(product.price)}</div>
                            <button class="add-to-cart" data-id="${product.id}" data-type="${product.category}">Add to Cart</button>
                        </div>
                    `;
                    
                    gridContainer.appendChild(productCard);
                });
                
                // Add event listeners for the add to cart buttons
                gridContainer.querySelectorAll('.add-to-cart').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const productId = parseInt(this.getAttribute('data-id'));
                        const productType = this.getAttribute('data-type');
                        const product = allProducts.find(p => p.id === productId && p.category === productType);
                        
                        if (product) {
                            addToCart(product, productType);
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error loading suggested products:', error);
                gridContainer.innerHTML = '<p>Failed to load suggested products. Please try again later.</p>';
            });
    }
    
    // Helper function to get random products
    function getRandomProducts(products, count) {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    function addToCart(product, productType) {
        const existingProductIndex = cart.findIndex(item => 
            item.id === product.id && item.type === productType
        );
        
        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description || '',
                quantity: 1,
                type: productType
            });
        }
        
        saveCart();
        renderCart();
        updateBasketCount();
        showNotification(`${product.name} added to cart!`);
    }
    
    // Initialize
    renderCart();
    updateBasketCount();
    loadSuggestedProducts();
    
    // Navigation event listeners
    document.getElementById('addProductsBtn')?.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    document.querySelector('.empty-cart button')?.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});