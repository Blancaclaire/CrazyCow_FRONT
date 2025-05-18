
document.addEventListener("DOMContentLoaded", () =>{
    //referencias a elementos DOM
    const productForm = document.getElementById("product-form");
    const ingredientInput = document.getElementById("ingredient-input");
    const addIngredientButton = document.getElementById("add-ingredient");
    const ingredientList = document.getElementById("ingredient-list");
    const imageInput = document.getElementById("product-image");
    const imagePreview = document.getElementById("image-preview");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    //mapeo de categorias a ids
    const categoryIds = {
        'burgers': '1000',
        'forBitting': '1001',
        'drinks': '1002',
        'desserts': '1003'
    };

    //ingredientes-agregar
    addIngredientButton.addEventListener("click", () => {
        const ingredientValue = ingredientInput.value.trim();
        if (ingredientValue !== ""){
            addIngredientToList(ingredientValue);
            ingredientInput.value = ""; 
        }
    });

    //funcion para agregar ingredientes a la lista
    function addIngredientToList (ingredient){
        const listItem = document.createElement("li");
        listItem.textContent = ingredient;

        //boton para eliminar ingrediente
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = () => listItem.remove();

        listItem.appendChild(deleteButton);
        ingredientList.appendChild(listItem);
    }

    //vista previa de la imagen subida
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

    //manejar envio del formulario
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        //recopilar datos del formulario
        const categoryName = document.getElementById("category-id").value;
        const categoryId = categoryIds[categoryName] || categoryName; //usar el mapeo o el valor
        const productName = document.getElementById("product-name").value;
        const productPrice = document.getElementById("product-price").value;
        const productDescription = document.getElementById("product-description").value;
        const imageFile = imageInput.files[0];

        //validaciones basicas
        if (!categoryId || !productName || !productPrice || !productDescription){
            showMessage(errorMessage, "Please fill all required fields");
            return;
        }

        try{
            //recopilar ingredientes
            const ingredients = [];
            ingredientList.querySelectorAll("li").forEach (li => {
                ingredients.push(li.textContent.replace("X", "").trim());
            });

            //preparar datos para enviar al controlador
            let url = new URL("http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.ADD", window.location.origin);

            //añadir parametros
            url.searchParams.append("category_id", categoryId);
            url.searchParams.append("product_name", productName);
            url.searchParams.append("description", productDescription);
            url.searchParams.append("price", productPrice);

            //para la imagen, usamos el nombre del archivo seleccionado
            //en un sistema real, habria que subir la imagen a un servidor
            if (imageFile) {
                url.searchParams.append("image", imageFile.name);
            } else {
                url.searchParams.append("image", "default.png");
            }

            //realizar la peticion al servidor
            const response = await fetch (url.toString());

            if (response.ok){
                const result = await response.text();
                console.log("Server response: ", result);

                //mostrar mensaje de exito
                showMessage(successMessage, "Product addred successfully!");

                //reiniciar formulario
                productForm.reset();
                ingredientList.innerHTML = '';
                imagePreview.style.display = "none";
            } else {
                showMessage(errorMessage, "Server error: Could not add product");
            }
        } catch (error) {
            console.error ("Error: ", error);
            showMessage(errorMessage, "Connection error. Please try again.");
        }
    });

    //funcion para mostrar mensajes
    function showMessage(element, message){
        element.textContent = message;
        element.style.display = "block";

        //ocultar para mostrar mensajes
        setTimeout(() => {
            element.style.display = "none";
        }, 5000);
    }
});