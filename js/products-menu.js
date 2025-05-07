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

// Inicialización cuando el DOM está cargado
window.addEventListener('DOMContentLoaded', function () {
  // Cargar carrito desde localStorage
  loadCart();

  // Configurar los event listeners para las pestañas
  setupTabListeners();

  // Cargar los productos de la primera pestaña (burgers)
  getProducts('burgers');
});

// Configurar los event listeners para las pestañas
function setupTabListeners() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const pawImage = document.getElementById('pawImageSrc');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Quitar clase active de todos los botones y contenidos
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Añadir clase active al botón y contenido seleccionado
      const tabId = this.getAttribute('data-tab');
      this.classList.add('active');
      document.getElementById(tabId + 'Tab').classList.add('active');

      // Cambiar imagen de pezuña
      const pawSrc = this.getAttribute('data-paw');
      pawImage.src = '../imagenes/' + pawSrc;

      // Mapear el ID de la pestaña al endpoint correcto
      let endpoint;
      switch (tabId) {
        case 'burguers':
          endpoint = 'burgers';
          break;
        case 'desserts':
          endpoint = 'desserts';
          break;
        case 'drinks':
          endpoint = 'drinks';
          break;
        case 'forbitting':
          endpoint = 'forBiting';
          break;
        default:
          endpoint = 'burgers';
      }

      // Cargar productos para esta pestaña
      getProducts(endpoint);
    });
  });
}

// Función para obtener productos desde la API
async function getProducts(endpoint) {
  try {
    // Mostrar el loader en la grid correcta
    const gridId = mapEndpointToGridId(endpoint);
    const grid = document.getElementById(gridId);
    grid.innerHTML = '<div class="loader"></div>';

    // Obtener los productos de la API si no están ya en caché
    if (!productsData[endpoint]) {
      const url = `http://localhost:3000/${endpoint}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      productsData[endpoint] = data;
    }
    
    // Mostrar los productos
    displayProducts(endpoint);
    
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    const gridId = mapEndpointToGridId(endpoint);
    const grid = document.getElementById(gridId);
    grid.innerHTML = `
      <div style="text-align: center; grid-column: 1 / -1; padding: 2rem;">
        <h3>Products could not be loaded</h3>
        <p>Please try again later</p>
      </div>
    `;
  }
}

// Mapear endpoint de API a ID de grid
function mapEndpointToGridId(endpoint) {
  switch (endpoint) {
    case 'burgers': return 'burgersGrid';
    case 'desserts': return 'dessertsGrid';
    case 'drinks': return 'drinksGrid';
    case 'forBiting': return 'bittingsGrid';
    default: return 'burgersGrid';
  }
}

// Función para mostrar productos en la grid correspondiente
function displayProducts(endpoint) {
  const gridId = mapEndpointToGridId(endpoint);
  const grid = document.getElementById(gridId);
  const products = productsData[endpoint];
  
  grid.innerHTML = ''; // Limpiar el contenedor
  
  if (!products || products.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; grid-column: 1 / -1; padding: 2rem;">
        <h3>No products available</h3>
      </div>
    `;
    return;
  }
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.setAttribute('data-product-id', product.id);
    
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price}€</p>
      </div>
    `;
    
    // Añadir event listener para mostrar detalles
    productCard.addEventListener('click', () => {
      showProductDetail(product.id, endpoint);
    });
    
    grid.appendChild(productCard);
  });
}

// Variable para almacenar el ID del producto actual en el modal
let currentProductId = null;
let currentProductEndpoint = null;

// Mostrar los detalles del producto
function showProductDetail(productId, endpoint) {
  const product = productsData[endpoint].find(p => p.id == productId);
  const detailElement = document.getElementById('productDetail');
  const detailTitle = document.getElementById('detailTitle');
  const detailBody = document.getElementById('detailBody');
  
  if (product) {
    // Guardar el ID del producto actual y el endpoint
    currentProductId = product.id;
    currentProductEndpoint = endpoint;
    
    detailTitle.textContent = product.name;
    
    // Crear el contenido HTML para los detalles
    let detailContent = `
      <div class="detail-image">
        <img src="${product.image}" alt="${product.name}" class="detail-img">
      </div>
      <div class="detail-info">
    `;
    
    // Añadir descripción
    if (product.description) {
      detailContent += `<p class="detail-description">${product.description}</p>`;
    }
    
    // Añadir ingredientes
    if (product.ingredients && product.ingredients.length > 0) {
      detailContent += `
        <h3 class="ingredients-title">Ingredients:</h3>
        <ul class="ingredients-list">
          ${product.ingredients.map(ingredient => `<li class="ingredient-item">${ingredient}</li>`).join('')}
        </ul>
      `;
    }
    
    // Añadir alérgenos
    if (product.allergens && product.allergens.length > 0) {
      detailContent += `
        <h3 class="allergens-title">Allergens:</h3>
        <p class="allergens-list">${product.allergens.join(', ')}</p>
      `;
    }
    
    // Añadir precio
    if (product.price) {
      detailContent += `<div class="detail-price">${product.price}€</div>`;
    }
    
    // Selector de cantidad
    detailContent += `
      <div class="quantity-selector">
        <button class="quantity-btn decrease-btn" id="decreaseQuantity">-</button>
        <span class="quantity-value" id="quantityValue">1</span>
        <button class="quantity-btn increase-btn" id="increaseQuantity">+</button>
      </div>
      
      <button class="add-to-cart-btn" id="addToCartBtn">Add to cart</button>
    </div>
    `;
    
    // Actualizar el contenido
    detailBody.innerHTML = detailContent;
    
    // Añadir event listeners para los botones de cantidad y añadir al carrito
    setupQuantityButtons();
    
    // Mostrar el modal
    detailElement.classList.add('active');
  } else {
    console.error('Product not found:', productId);
  }
}

// Configurar botones de cantidad
function setupQuantityButtons() {
  const decreaseBtn = document.getElementById('decreaseQuantity');
  const increaseBtn = document.getElementById('increaseQuantity');
  const quantityValue = document.getElementById('quantityValue');
  const addToCartBtn = document.getElementById('addToCartBtn');
  
  let quantity = 1;
  
  decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
    }
  });
  
  increaseBtn.addEventListener('click', () => {
    quantity++;
    quantityValue.textContent = quantity;
  });
  
  addToCartBtn.addEventListener('click', () => {
    if (currentProductId) {
      addToCart(currentProductId, quantity);
      closeProductDetail();
    }
  });
}

// Cerrar el modal de detalles
function closeProductDetail() {
  const detailElement = document.getElementById('productDetail');
  detailElement.classList.remove('active');
  currentProductId = null;
  currentProductEndpoint = null;
}

// Event listener para cerrar el detalle
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('closeDetail').addEventListener('click', closeProductDetail);
  
  // Cerrar el detalle al hacer clic fuera del contenido
  document.getElementById('productDetail').addEventListener('click', (e) => {
    if (e.target === document.getElementById('productDetail')) {
      closeProductDetail();
    }
  });
});

// Función para calcular el total del carrito con descuentos aplicados
function calculateCartTotal(cart, discount = 0, freeShipping = false) {
  // Calcular subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Calcular descuento
  const discountAmount = subtotal * discount;
  
  // Calcular envío (ejemplo simple)
  const shippingCost = freeShipping ? 0 : (subtotal > 20 ? 0 : 2.99);
  
  // Calcular total
  const total = subtotal - discountAmount + shippingCost;
  
  return {
    subtotal: subtotal.toFixed(2),
    discount: discountAmount.toFixed(2),
    shipping: shippingCost.toFixed(2),
    total: total.toFixed(2)
  };
}