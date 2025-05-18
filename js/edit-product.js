document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos DOM
    const editForm = document.getElementById("edit-form");
    const ingredientInput = document.getElementById("ingredient-input");
    const addIngredientButton = document.getElementById("add-ingredient");
    const ingredientList = document.getElementById("ingredient-list");
    const imageInput = document.getElementById("product-image");
    const imagePreview = document.getElementById("image-preview");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");
    const categorySelect = document.getElementById("category-select");
    const productSelect = document.getElementById("product-select");

    // Mapeo de categorías a ids
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
                const response = await fetch(`http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.FIND_ALL&category_id=${categoryId}`);
                
                if (response.ok) {
                    const products = await response.json();
                    
                    // Limpiar y habilitar selector de productos
                    productSelect.innerHTML = '<option value="" disabled selected>Select a product</option>';
                    productSelect.disabled = false;
                    
                    // Llenar el selector de productos
                    products.forEach(product => {
                        const option = document.createElement("option");
                        option.value = product.product_id || product.PRODUCT_ID;
                        option.textContent = product.product_name || product.PRODUCT_NAME;
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

    // Cargar detalles del producto cuando se selecciona
    productSelect.addEventListener("change", async () => {
        const productId = productSelect.value;
        
        if (productId) {
            try {
                const response = await fetch(`http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.FIND_BY_ID&product_id=${productId}`);
                
                if (response.ok) {
                    const product = await response.json();
                    
                    // Rellenar formulario con los datos del producto
                    document.getElementById("product-name").value = product.product_name || product.PRODUCT_NAME;
                    document.getElementById("product-price").value = product.price || product.PRICE;
                    document.getElementById("product-description").value = product.description || product.DESCRIPTION;
                    
                    // Mostrar imagen actual
                    if (product.image || product.IMAGE) {
                        imagePreview.src = `../imagenes/products/${product.image || product.IMAGE}`;
                        imagePreview.style.display = "block";
                    }
                    
                    // Cargar ingredientes (si tu modelo los tiene)
                    if (product.ingredients || product.INGREDIENTS) {
                        const ingredients = product.ingredients || product.INGREDIENTS;
                        ingredientList.innerHTML = '';
                        ingredients.forEach(ingredient => {
                            addIngredientToList(ingredient);
                        });
                    }
                } else {
                    showMessage(errorMessage, "Error loading product details");
                }
            } catch (error) {
                console.error("Error:", error);
                showMessage(errorMessage, "Connection error. Please try again.");
            }
        }
    });

    // Ingredientes - agregar
    addIngredientButton.addEventListener("click", () => {
        const ingredientValue = ingredientInput.value.trim();
        if (ingredientValue !== ""){
            addIngredientToList(ingredientValue);
            ingredientInput.value = "";
        }
    });

    // Función para agregar ingredientes a la lista
    function addIngredientToList(ingredient) {
        const listItem = document.createElement("li");
        listItem.textContent = ingredient;

        // Botón para eliminar ingrediente
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = () => listItem.remove();

        listItem.appendChild(deleteButton);
        ingredientList.appendChild(listItem);
    }

    // Vista previa de la imagen subida
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar envío del formulario (actualizar producto)
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const productId = productSelect.value;
        const categoryId = categorySelect.value;
        const productName = document.getElementById("product-name").value;
        const productPrice = document.getElementById("product-price").value;
        const productDescription = document.getElementById("product-description").value;
        const imageFile = imageInput.files[0];

        // Validaciones básicas
        if (!productId || !categoryId || !productName || !productPrice || !productDescription) {
            showMessage(errorMessage, "Please fill all required fields");
            return;
        }

        try {
            // Recopilar ingredientes
            const ingredients = [];
            ingredientList.querySelectorAll("li").forEach(li => {
                ingredients.push(li.textContent.replace("X", "").trim());
            });

            // Preparar datos para enviar al controlador
            let url = new URL("http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.UPDATE", window.location.origin);

            // Añadir parámetros
            url.searchParams.append("product_id", productId);
            url.searchParams.append("category_id", categoryId);
            url.searchParams.append("product_name", productName);
            url.searchParams.append("description", productDescription);
            url.searchParams.append("price", productPrice);

            // Para la imagen, usamos el nombre del archivo seleccionado
            if (imageFile) {
                url.searchParams.append("image", imageFile.name);
            }

            // Realizar la petición al servidor
            const response = await fetch(url.toString());

            if (response.ok) {
                const result = await response.text();
                console.log("Server response: ", result);

                // Mostrar mensaje de éxito
                showMessage(successMessage, "Product updated successfully!");

            } else {
                showMessage(errorMessage, "Server error: Could not update product");
            }
        } catch (error) {
            console.error("Error: ", error);
            showMessage(errorMessage, "Connection error. Please try again.");
        }
    });

    // Función para mostrar mensajes
    function showMessage(element, message) {
        element.textContent = message;
        element.style.display = "block";

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            element.style.display = "none";
        }, 5000);
    }
});