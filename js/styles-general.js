// Función para controlar el menú hamburguesa
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('overlay');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic en el overlay
    overlay.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Cerrar el menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-button');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    });
});


// Variable global para almacenar los datos de productos
let productsData = {};

// Carrito de compras
let cart = [];

// Función para cargar el carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('burgerCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('burgerCart', JSON.stringify(cart));
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const basketCount = document.getElementById('basketCount');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    basketCount.textContent = totalItems;

    // Añadir animación al cambiar
    basketCount.classList.add('pulse');
    setTimeout(() => {
        basketCount.classList.remove('pulse');
    }, 500);
}

// Función para añadir un producto al carrito
function addToCart(productId, quantity = 1) {
    // Determinar a qué categoría pertenece el producto
    let product = null;
    let categoryData = null;

    // Buscar en todas las categorías
    for (const category in productsData) {
        const foundProduct = productsData[category].find(item => item.id == productId);
        if (foundProduct) {
            product = foundProduct;
            categoryData = productsData[category];
            break;
        }
    }

    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Comprobar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(item => item.id == productId);

    if (existingItemIndex !== -1) {
        // Incrementar la cantidad si ya existe
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Añadir nuevo item si no existe
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    // Guardar en localStorage y actualizar contador
    saveCart();
    updateCartCount();

    // Mostrar mensaje de confirmación
    showAddToCartMessage();
}

// Función para mostrar mensaje de añadido al carrito
function showAddToCartMessage() {
    const message = document.getElementById('addToCartMessage');
    message.classList.add('show');

    // Ocultar después de 2 segundos
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}


document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        // Redirige a la sección correspondiente en products-menu.html
        window.location.href = `../html/products-menu.html#${tab}`;
    });
});
