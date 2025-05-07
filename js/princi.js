// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Get the necessary elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-container ul');
    const overlayBg = document.getElementById('overlayBg');
    
    // Toggle the navigation menu when the hamburger button is clicked
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlayBg.classList.toggle('active');
    });
    
    // Close the menu when clicking on the overlay background
    overlayBg.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        overlayBg.classList.remove('active');
    });
    
    // Close the menu when clicking on a menu item
    const navLinks = document.querySelectorAll('.nav-button');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlayBg.classList.remove('active');
        });
    });
    
    // Close the menu when clicking on the basket button
    const basketButton = document.querySelector('.basket-button');
    if (basketButton) {
        basketButton.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlayBg.classList.remove('active');
        });
    }
    
    // Close the menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlayBg.classList.remove('active');
        }
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
