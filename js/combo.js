async function getListProducts() {
    try {
        const response = await fetch('http://localhost:8080/CrazyCow_Server/Controller?ACTION=PRODUCT.FIND_ALL');
        if (!response.ok) {
            throw new Error("Error");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error');
        throw error;
    }
}

async function generateCombo() {
    try {
        document.getElementById('menuItems').innerHTML = '<div class="cargando">Cargando menu del dia...</div>';


        const products = await getListProducts();

        if (!products || products.length === 0) {
            document.getElementById('menuItems').innerHTML = '<div class="error">No hay productos disponibles.</div>';
            return;
        }


        const productsByCategory = {
            1000: products.filter(p => p.category_id === 1000),
            1001: products.filter(p => p.category_id === 1001),
            1002: products.filter(p => p.category_id === 1002),
            1003: products.filter(p => p.category_id === 1003)
        };


        const menuCombo = [];
        const categories = [
            { id: 1000, name: "Burgers" },
            { id: 1001, name: "ForBittings" },
            { id: 1002, name: "Drinks" },
            { id: 1003, name: "Desserts" }
        ];

        categories.forEach(category => {
            const categoryProducts = productsByCategory[category.id];
            if (categoryProducts && categoryProducts.length > 0) {
                const randomIndex = Math.floor(Math.random() * categoryProducts.length);
                const randomProduct = categoryProducts[randomIndex];
                menuCombo.push({
                    ...randomProduct,
                    categoryName: category.name
                });
            }
        });

        displayMenuCombo(menuCombo);
    } catch (error) {
        console.error('Error generando menu:', error);
        document.getElementById('menuItems').innerHTML = '<div class="error">Error al cargar los productos</div>';
    }
}

function displayMenuCombo(menuItems) {
    const menuContainer = document.getElementById('menuItems');

    if (!menuItems || menuItems.length === 0) {
        return;
    }

    let menuHTML = '';

    menuItems.forEach(item => {

        menuHTML += `
            <div class="menu-products">
                <img src="../imagenes/${item.image}" 
                     alt="${item.product_name}" 
                     class="item-image">
                <div class="item-name">${item.product_name}</div>
                <div class="item-price">€${parseFloat(item.price).toFixed(2)}</div>
            </div>
        `;
    });

    menuContainer.innerHTML = menuHTML;
}
