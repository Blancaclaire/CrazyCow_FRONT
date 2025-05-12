window.addEventListener('DOMContentLoaded', function() {
    getListProducts();
});

getListProducts = async ($type) => {
    const url=`http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.FIND_ALL` // Se iguala la URL de la API a una constante para que nos e repita el codigo

    //fetch(url) hace la peticion a la API
    //await espera a que la promesa se resuelva antes de continuar con el siguiente paso
    
    try{
        const response = await fetch(url); 
   
    console.log('Api results are',response);

    //La API respone con texto en formato JSON. Esto lo convierte en un objeto JavaScript para poder usarlo.
    const data = await response.json();
    console.log(data);

    printProducts(data);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
    
};

printProducts = (data) => {
    let burgerGrid = document.querySelector('.burguers-grid');

    burgerGrid.innerHTML = ''; //Clean the buffer
    
    data.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('burger');
        div.id = item.id;


        //Rellenamos el div de la hamburguesa
        div.innerHTML = `
        <a href="#=${item.id}">  
            <img src="${item.image}" alt="${item.name}">
            <div class="title">${item.product_name || ''}</div>
        </a>`;

        // añadir enlaces a las paginas
        
        burgerGrid.appendChild(div); //Añade el contenido definitivamente
    });
};