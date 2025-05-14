document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos DOM
    const deleteForm = document.getElementById("delete-form");
    const categorySelect = document.getElementById("category-select");
    const productSelect = document.getElementById("product-select");
    const productPreview = document.getElementById("product-preview");
    const productImage = document.getElementById("product-image-preview");
    const productName = document.getElementById("product-name-preview");
    const productPrice = document.getElementById("product-price-preview");
    const productDescription = document.getElementById("product-description-preview");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    // Mapeo de categorías a ids (opcional, según tu implementación)
    const categoryIds = {
        'burgers': '1000',
        'forBitting': '1001',
        'drinks': '1002',
        'desserts': '1003'
    };

    // Cargar productos cuando cambia la categoría
    categorySelect.addEventListener("change", async () => {
        const categoryId = categorySelect.value;
        
        if (categoryId) {
            try {
                // Construir URL para obtener productos
                let url = new URL("http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.FIND_ALL", window.location.origin);
                url.searchParams.append("category_id", categoryId);

                // Realizar petición al servidor
                const response = await fetch(url.toString());

                if (response.ok) {
                    const products = await response.json();
                    
                    // Limpiar y habilitar selector de productos
                    productSelect.innerHTML = '<option value="" disabled selected>Select a product</option>';
                    productSelect.disabled = false;
                    
                    // Llenar el selector de productos
                    products.forEach(product => {
                        const option = document.createElement("option");
                        option.value = product.product_id;
                        option.textContent = product.product_name;
                        productSelect.appendChild(option);
                    });
                } else {
                    showMessage(errorMessage, "Error loading products");
                }
            } catch (error) {
                console.error("Error:", error);
                showMessage(errorMessage, "Connection error. Please try again.");
            }
        }
    });

    // Mostrar detalles del producto cuando se selecciona
    productSelect.addEventListener("change", async () => {
        const productId = productSelect.value;
        
        if (productId) {
            try {
                // Construir URL para obtener detalles del producto
                let url = new URL("http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.FIND_BY_ID", window.location.origin);
                url.searchParams.append("product_id", productId);

                // Realizar petición al servidor
                const response = await fetch(url.toString());

                if (response.ok) {
                    const product = await response.json();
                    
                    // Mostrar vista previa del producto
                    productImage.src = `../imagenes/products/${product.image || 'default.png'}`;
                    productName.textContent = product.product_name;
                    productPrice.textContent = `$${product.price.toFixed(2)}`;
                    productDescription.textContent = product.description;
                    productPreview.style.display = "flex";
                } else {
                    showMessage(errorMessage, "Error loading product details");
                }
            } catch (error) {
                console.error("Error:", error);
                showMessage(errorMessage, "Connection error. Please try again.");
            }
        }
    });

    // Manejar envío del formulario (eliminar producto)
    deleteForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const productId = productSelect.value;

        // Validación básica
        if (!productId) {
            showMessage(errorMessage, "Please select a product to delete");
            return;
        }

        try {
            // Confirmación antes de eliminar
            if (!confirm("Are you sure you want to delete this product?")) {
                return;
            }

            // Construir URL para eliminar producto
            let url = new URL("http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.DELETE", window.location.origin);
            url.searchParams.append("product_id", productId);

            // Realizar petición al servidor
            const response = await fetch(url.toString());

            if (response.ok) {
                const result = await response.text();
                console.log("Server response: ", result);

                // Mostrar mensaje de éxito
                showMessage(successMessage, "Product deleted successfully!");

                // Reiniciar formulario
                deleteForm.reset();
                productSelect.innerHTML = '<option value="" disabled selected>Select a product</option>';
                productSelect.disabled = true;
                productPreview.style.display = "none";

                // Recargar productos si hay categoría seleccionada
                if (categorySelect.value) {
                    categorySelect.dispatchEvent(new Event("change"));
                }
            } else {
                showMessage(errorMessage, "Server error: Could not delete product");
            }
        } catch (error) {
            console.error("Error: ", error);
            showMessage(errorMessage, "Connection error. Please try again.");
        }
    });

    // Función para mostrar mensajes (igual que en add)
    function showMessage(element, message) {
        element.textContent = message;
        element.style.display = "block";

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            element.style.display = "none";
        }, 5000);
    }
});