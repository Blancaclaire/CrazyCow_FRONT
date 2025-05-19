// Ejecutar cuando el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("Employee details page initialised");
    initializeEmployeeDetailsPage();
});

function initializeEmployeeDetailsPage() {
    console.log("Initialising employee details page...");
    
    // Intentar obtener el email del empleado del sessionStorage (de login)
    const email = sessionStorage.getItem('employeeEmail');
    console.log("Email en sessionStorage:", email);
    
    if (email) {
        // Si hay email en sessionStorage, usarlo
        fetchEmployeeProfile(email);
    } else {
        // Si no, intentar obtenerlo de la URL (acceso directo)
        const urlParams = new URLSearchParams(window.location.search);
        const urlEmail = urlParams.get('email');
        console.log("Email en URL:", urlEmail);
        
        if (urlEmail) {
            fetchEmployeeProfile(urlEmail);
        } else {
            // Si no hay email disponible, mostrar error
            console.error("No employee email provided");
            showError("No employee email was provided. Please login first.");
        }
    }
}

function fetchEmployeeProfile(email) {
    // Mostrar mensaje de carga
    const infoSection = document.querySelector('.employee-info');
    const originalContent = infoSection ? infoSection.innerHTML : '';
    
    if (infoSection) {
        // Agregar mensaje de carga pero mantener el título y la imagen
        const h2 = infoSection.querySelector('h2');
        const img = infoSection.querySelector('img');
        
        infoSection.innerHTML = '';
        
        if (h2) infoSection.appendChild(h2);
        if (img) infoSection.appendChild(img);
        
        const loadingMsg = document.createElement('p');
        loadingMsg.className = 'loading';
        loadingMsg.textContent = 'Loading profile...';
        infoSection.appendChild(loadingMsg);
    } else {
        console.warn("Could not find .employee-info element to display upload message");
    }
    
    
    const apiUrl = `http://localhost:8080/api/Controller?ACTION=EMPLOYEE.FIND_ALL&email=${encodeURIComponent(email)}`;
    console.log("Applying for profile from:", apiUrl);
    
    // Realizar la petición para obtener detalles del empleado
    fetch(apiUrl)
        .then(response => {
            console.log("Server response status:", response.status);
            if (!response.ok) {
                throw new Error(`The server responded with status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Data received:", data.substring(0, 100) + (data.length > 100 ? '...' : ''));
            
            try {
                // Si la respuesta comienza con "Error", manejarla como mensaje de error
                if (data.trim().startsWith("Error")) {
                    throw new Error(data);
                }
                
                // Intentar analizar como JSON - La API devuelve un array, no un objeto único
                const employees = JSON.parse(data);
                if (!employees || !Array.isArray(employees) || employees.length === 0) {
                    throw new Error("No employee found with that email");
                }
                
                // Tomar el primer empleado del array (debería ser el único)
                const employee = employees[0];
                displayEmployeeProfile(employee);
            } catch (e) {
                // Si no es un JSON válido, podría ser un mensaje de error
                console.error('Error processing response:', e);
                
                // Restaurar el contenido original si hay un error
                if (infoSection && originalContent) {
                    infoSection.innerHTML = originalContent;
                }
                
                showError("Error loading profile: " + (e.message || data));
            }
        })
        .catch(error => {
            console.error('Error obtaining employee:', error);
            
            // Restaurar el contenido original si hay un error
            if (infoSection && originalContent) {
                infoSection.innerHTML = originalContent;
            }
            
            showError("Error loading profile. Please try again later.");
        });
}

function displayEmployeeProfile(employee) {
    console.log("Showing employee profile:", employee);
    
    // Asegurar que tenemos un objeto de empleado antes de actualizar
    if (!employee || typeof employee !== 'object') {
        showError("Invalid employee data received");
        return;
    }
    
    // Restaurar el HTML original si fue modificado por el mensaje de carga
    const infoSection = document.querySelector('.employee-info');
    if (infoSection) {
        // Eliminar el mensaje de carga si existe
        const loadingMsg = infoSection.querySelector('.loading');
        if (loadingMsg) {
            loadingMsg.remove();
        }
        
        // Asegurarse de que la estructura del HTML esté completa
        ensureEmployeeInfoStructure(infoSection);
    }
    
    // Actualizar todos los campos de datos del empleado con comprobaciones null
    updateElementText('name', employee.name);
    updateElementText('surname', employee.surname);
    updateElementText('email', employee.email);
    updateElementText('phone_number', employee.phone_number);
    updateElementText('user_name', employee.user_name);
    updateElementText('password', '••••••••'); // No mostrar la contraseña real
    updateElementText('address', employee.address);
    updateElementText('start_date', formatDate(employee.start_date));
    updateElementText('salary', employee.salary);
    updateElementText('id', employee.employee_id);
    updateElementText('departamento', employee.job_id);

// BOTONES DE ACCION SEGUN EL DEPARTAMENTO
     const actionsDiv = document.querySelector('.actions');
    if (actionsDiv && employee.restaurant_id) {
        // Limpiar el contenedor por si acaso
        actionsDiv.innerHTML = '';

        // Verificar si el empleado tiene job_id 6001 correspondientes  alos empleados del departamento de cocina o eres camarero
        if (employee.job_id == 6001 || employee.job_id == 6002 ) { 
            const ordersButton = document.createElement('a');
            ordersButton.href = `../html/orders.html?restaurant_id=${employee.restaurant_id}`;
            ordersButton.className = 'bt-orders';
            ordersButton.textContent = 'Orders';
            actionsDiv.appendChild(ordersButton);
        }// Botón para job_id 6004 (Applicants)
        else if (employee.job_id == 6004) {
            const applicantsButton = document.createElement('a');
            applicantsButton.href = `../html/applicants.html`; // Ajusta la URL según tu estructura
            applicantsButton.className = 'bt-applicants';
            applicantsButton.textContent = 'View Applicants';
            actionsDiv.appendChild(applicantsButton);
        }   // Botón para job_id 6003 (Control Panel)
        else if (employee.job_id == 6003) {
            const applicantsButton = document.createElement('a');
            applicantsButton.href = `../html/control-panel.html`; // Ajusta la URL según tu estructura
            applicantsButton.className = 'bt-applicants';
            applicantsButton.textContent = 'Control Panel';
            actionsDiv.appendChild(applicantsButton);
        }
         else {
            console.log("Este empleado no tiene permisos ");
        }
    }

}

function ensureEmployeeInfoStructure(infoSection) {
    // Verificar si ya tiene la estructura correcta
    if (infoSection.querySelector('#name')) return;
    
    // Si no, recrear la estructura desde cero
    infoSection.innerHTML = `
        <h2>Employee Profile</h2>
        <img src="../imagenes/empleada.png" alt="Employee photo" class="profile-pic" />
        
        <p><strong>Name:</strong> <span id="name"></span> <span id="surname"></span></p>
        <p><strong>Email:</strong> <span id="email"></span></p>
        <p><strong>Phone:</strong> <span id="phone_number"></span></p>
        <p><strong>Username:</strong> <span id="user_name"></span></p>
        <p><strong>Password:</strong> <span id="password"></span></p>
        <p><strong>Address:</strong> <span id="address"></span></p>
        <p><strong>Start Date:</strong> <span id="start_date"></span></p>
        <p><strong>Salary:</strong> $<span id="salary"></span></p>
        <p><strong>ID:</strong> <span id="id"></span></p>
        <p><strong>Department:</strong> <span id="departamento"></span></p>
    `;
}

function updateElementText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value || '';
    } else {
        console.warn(`Element with ID '${id}' not found in the document`);
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Comprobar si la fecha es válida
        if (isNaN(date.getTime())) {
            console.warn(`Fecha inválida: ${dateString}`);
            return dateString; // Devolver cadena original si la fecha es inválida
        }
        return date.toLocaleDateString();
    } catch (e) {
        console.error('Error formateando fecha:', e);
        return dateString || '';
    }
}

function showError(message) {
    console.error("Error:", message);
    const container = document.querySelector('.container');
    
    if (container) {
        // Guardar los botones de acción si existen
        const actions = container.querySelector('.actions');
        
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <a href="../html/login-employee.html" class="bt-back">Volver al login</a>
            </div>
        `;
        
        // Restaurar los botones de acción si existían
        if (actions) {
            container.appendChild(actions);
        }
    } else {
        alert("Error: " + message);
    }
}
