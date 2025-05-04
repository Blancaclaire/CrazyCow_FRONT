document.addEventListener("DOMContentLoaded", () => {
    const ingredientInput = document.getElementById("ingredient-input");
    const addIngredientButton = document.getElementById("add-ingredient");
    const ingredientList = document.getElementById("ingredient-list");
    const imageInput = document.getElementById("product-image");
    const imagePreview = document.getElementById("image-preview");

    // Funcion para agregar un ingrediente
    addIngredientButton.addEventListener("click", () => {
        const ingredientValue = ingredientInput.value.trim();
        if (ingredientValue !== "") {
            const listItem = document.createElement("li");
            listItem.textContent = ingredientValue;

            // Boton para eliminar ingrediente
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = () => listItem.remove();
            
            listItem.appendChild(deleteButton);
            ingredientList.appendChild(listItem);
            
            ingredientInput.value = ""; // Limpiar el input despues de agregar
        }
    });

    // Vista previa de la imagen subida
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];//Obtiene el primer archivo seleccionado
        if (file) {
            const reader = new FileReader(); //FileReader para leer el archivo
            reader.onload = (e) => { //Cuando la alecture se complete
                imagePreview.src = e.target.result; //Asigna la imagen a la etiqueta <img>
                imagePreview.style.display = "block"; //hace visible la imagen
            };
            reader.readAsDataURL(file); //Convierte la imagen en base 64 y la carga
        }
    });
});
