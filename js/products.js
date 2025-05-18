// Función para controlar el menú hamburguesa
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('overlay');
  
    navToggle?.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      overlay.classList.toggle('active');
    });
  
    // Cerrar el menú al hacer clic en el overlay
    overlay?.addEventListener('click', function () {
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

document.addEventListener('DOMContentLoaded', function() {
    // Load products on startup
    getListProducts();
    
    // Set up close functionality for product detail modal
    document.getElementById('closeDetail')?.addEventListener('click', function() {
        document.getElementById('productDetail').classList.remove('active');
    });
    
    // Close detail when clicking outside the content
    document.getElementById('productDetail')?.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// Function to get products from the API
async function getListProducts() {
    try {
        // Show loading indicator in all grids
        document.querySelectorAll('.products-grid').forEach(grid => {
            grid.innerHTML = '<div class="loading">Loading products...</div>';
        });
        
        const response = await fetch('http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.FIND_ALL');
        const data = await response.json();
        
        // Display products in their respective categories
        displayProductsByCategory(data);
    } catch (error) {
        console.error('Error loading products:', error);
        document.querySelectorAll('.products-grid').forEach(grid => {
            grid.innerHTML = '<div class="error">Error loading products. Please try again later.</div>';
        });
    }
}

// Display products organized by category
function displayProductsByCategory(products) {
    // Clear all grids first
    document.querySelectorAll('.products-grid').forEach(grid => {
        grid.innerHTML = '';
    });
    
    // Check if there are products
    if (!products || products.length === 0) {
        document.querySelectorAll('.products-grid').forEach(grid => {
            grid.innerHTML = '<div class="no-products">No products available</div>';
        });
        return;
    }
    
    // Group products by category
    products.forEach(product => {
        let targetGrid;
        
        // Determine which grid the product belongs to based on category_id
        if (product.category_id === 1000) {
            targetGrid = 'burgersGrid';
        } else if (product.category_id === 1001) {
            targetGrid = 'bittingsGrid';
        } else if (product.category_id === 1002) {
            targetGrid = 'drinksGrid';
        } else if (product.category_id === 1003) {
            targetGrid = 'dessertsGrid';
        } else {
            // Default fallback (opcional)
            targetGrid = 'bittingsGrid'; // o cualquier otro por defecto
        }
        
        // Create and add the product element to the appropriate grid
        createProductElement(product, targetGrid);
    });
}

// Create product element and add it to the corresponding grid
function createProductElement(product, gridId) {
    const grid = document.getElementById(gridId);
    
    // If the grid doesn't exist, exit
    if (!grid) return;
    
    const productElement = document.createElement('div');
    productElement.className = 'product-item';
    productElement.innerHTML = `
        <a href="#" data-product-id="${product.product_id}">
            <img src="../imagenes/${product.image}" alt="${product.product_name}" onerror="this.src='../imagenes/placeholder.png'">
            <div class="product-info">
                <h3>${product.product_name}</h3>
                <p class="price">€${parseFloat(product.price).toFixed(2)}</p>
            </div>
        </a>
    `;
    
    // Add click event to show details
    productElement.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showProductDetails(product);
    });
    
    grid.appendChild(productElement);
}

// Show product details in modal
function showProductDetails(product) {
    const detailTitle = document.getElementById('detailTitle');
    const detailBody = document.getElementById('detailBody');
    
    // Set the title
    detailTitle.textContent = product.product_name;
    
    // Determinar la categoría del producto basado en su category_id
    let productType = 'forBitting'; // Default
    if (product.category_id === 1000) {
        productType = 'burgers';
    } else if (product.category_id === 1002) {
        productType = 'drinks';
    } else if (product.category_id === 1003) {
        productType = 'desserts';
    } else if (product.category_id === 1001) {
        productType = 'forBitting';
    }
    
    // Create the detail content
    detailBody.innerHTML = `
        <div class="detail-image">
            <img src="../imagenes/${product.image}" alt="${product.product_name}" 
                 onerror="this.src='../imagenes/placeholder.png'" 
                 style="max-width: 100%; border-radius: 10px;">
        </div>
        <div class="detail-info" style="margin-top: 1rem;">
            <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Precio: <strong style="color: #663399;">€${parseFloat(product.price).toFixed(2)}</strong></p>
            <p style="margin-bottom: 1rem;">${product.description || 'No hay descripción disponible para este producto.'}</p>
            <button class="add-to-cart-btn" 
                    data-id="${product.product_id}" 
                    data-name="${product.product_name}" 
                    data-price="${product.price}" 
                    data-image="${product.image}" 
                    data-description="${product.description || ''}" 
                    data-type="${productType}" 


                    
                    style="background-color: #9b8bb4; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: bold;">
                Añadir al carrito
            </button>
        </div>
    `;
    
    // Añadir el event listener para el botón de añadir al carrito
    detailBody.querySelector('.add-to-cart-btn').addEventListener('click', function(e) {
        const productData = {
            id: parseInt(this.getAttribute('data-id')),
            name: this.getAttribute('data-name'),
            price: parseFloat(this.getAttribute('data-price')),
            image: this.getAttribute('data-image'),
            description: this.getAttribute('data-description'),
            type: this.getAttribute('data-type')
        };
        
        addToCart(productData);
        document.getElementById('productDetail').classList.remove('active');
    });
    
    // Show the modal
    document.getElementById('productDetail').classList.add('active');
}