// Simulando un fetch desde una API
async function fetchDynamicText() {
    try {
      // Reemplaza la URL con la de tu API real
      const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
      const data = await response.json();
  
      // Supongamos que el texto dinámico viene en el campo "title"
      const dynamicText = data.title;
  
      // Actualizamos el contenido en la página
      document.getElementById("dynamic-text").textContent = dynamicText;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      document.getElementById("dynamic-text").textContent = "Error al cargar el texto.";
    }
  }
  
  // Llamamos a la función al cargar la página
  fetchDynamicText();
  