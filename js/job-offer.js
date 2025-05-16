// URL base del servidor (ajusta según tu configuración)
        const BASE_URL = 'http://localhost:8080/CrazyCow_Server/Controller';
        
        // Función para cargar todas las ofertas
        function loadAllOffers() {
            document.getElementById('offerTitle').value = '';
            loadOffers();
        }
        
        // Función principal para cargar ofertas
        function loadOffers() {
            const offerTitle = document.getElementById('offerTitle').value;
            const loadingElement = document.getElementById('loading');
            const offerListElement = document.getElementById('offerList');
            
            // Mostrar carga y limpiar lista
            loadingElement.style.display = 'block';
            offerListElement.innerHTML = '';
            
            // Construir URL según si hay filtro o no
            let url = `${BASE_URL}?ACTION=JOB_OFFER.FIND_ALL`;
            
            if (offerTitle) {
                url += `&title=${encodeURIComponent(offerTitle)}`;
            }
            
            // Hacer la petición AJAX
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error in server response');
                    }
                    return response.json();
                })
                .then(data => {
                    loadingElement.style.display = 'none';
                    
                    if (data && data.length > 0) {
                        renderOffers(data);
                    } else {
                        offerListElement.innerHTML = '<p class="text">No job offers were found.</p>';
                    }
                })
                .catch(error => {
                    loadingElement.style.display = 'none';
                    offerListElement.innerHTML = `<p class="error-message">Error when uploading offers: ${error.message}</p>`;
                    console.error('Error:', error);
                });
        }
        
        // Función para renderizar las ofertas en el HTML
        function renderOffers(offers) {
            const offerListElement = document.getElementById('offerList');
            let html = '';
            
            offers.forEach(offer => {
                html += `
                    <div class="rectangle" onclick="viewOfferDetails(${offer.id})">
                        <div class="content">
                            <h3 class="text3">${offer.title || 'Job offer'}</h3>
                            <p class="text2"><strong>Description:</strong> ${offer.description || 'No hay descripción disponible'}</p>
                            <p class="text2"><strong>Location:</strong> ${offer.location || 'No especificada'}</p>
                        </div>
                    </div>
                `;
            });
            
            offerListElement.innerHTML = html;
        }
        
        // Función para ver detalles de una oferta
        function viewOfferDetails(offerId) {
            // Redirigir a la página de detalles
            window.location.href = `../html/job-aplication.html`;
        }
        
        // Cargar ofertas al iniciar la página
        document.addEventListener('DOMContentLoaded', loadAllOffers);