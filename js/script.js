
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Functionality of the navigation menu
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {

        //Function to toggle the menu visibility when clicking
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active'); //Change menu button aspect to X
            navMenu.classList.toggle('active'); // Change navMenu visibility
        });

        
        //Function to close menu after clicking outside
        document.addEventListener('click', function(event) {
            const isNavToggle = event.target === navToggle || navToggle.contains(event.target);
            const isNavMenu = event.target === navMenu || navMenu.contains(event.target);

            if (!isNavToggle && !isNavMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }


    // 2. Functionality to control the password visbility  
    const toggleButton = document.querySelector('.password-toggle');
    const passwordInput = document.querySelector('input[type="password"]');

    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', function() {
        // Function to control visibilty of password
        // If you click and passwordInput is password change to text
        //And if you click and passwordInput is text, change to password
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.innerHTML = `
                    <svg fill="none" viewBox="0 0 24 24" class="eye-icon">
                        <path stroke-width="1.5" stroke="currentColor"
                            d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z">
                        </path>
                        <path stroke-width="1.5" stroke="currentColor" d="M4 4L20 20"></path>
                        <circle stroke-width="1.5" stroke="currentColor" r="3" cy="12" cx="12"></circle>
                    </svg>
                `;
            } else {
                passwordInput.type = 'password';
                toggleButton.innerHTML = `
                    <svg fill="none" viewBox="0 0 24 24" class="eye-icon">
                        <path stroke-width="1.5" stroke="currentColor"
                            d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z">
                        </path>
                        <circle stroke-width="1.5" stroke="currentColor" r="3" cy="12" cx="12"></circle>
                    </svg>
                `;
            }
        });
    }

    // 3. Register form
   
    const RegisterButton = document.querySelector('.submit-button');
    
    if (RegisterButton) {
        RegisterButton.addEventListener('click', async function(e) {
            e.preventDefault();

            // Values of the form
            const username = document.querySelector('input[placeholder="Username"]')?.value;
            const email = document.querySelector('input[placeholder="Email"]')?.value;
            const password = document.querySelector('input[placeholder="Password"]')?.value;

            
            // Basic Check
            if (!username || !email || !password) {
                alert('Please complete all fields');
                return;
            }

            const userData = { username, email, password };

            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message);
                    console.log(result);
                    limpiarFormulario(); // Cleans the form after register with succes
                    
                } else {
                    const error = await response.json();
                    alert(error.message || 'Error registering user');
                }
            } catch (error) {
                console.error('Error in the application:', error);
                alert('There was a problem connecting to the server.');
            }
        });
    }


    // 4. Login register

    // const form = document.querySelector('.modern-form');
    const LoginButton = document.querySelector(".login-button");

    if (LoginButton) {
        LoginButton.addEventListener('click', async function (e) {
            e.preventDefault();

            // Values of the form

            const email = document.querySelector('input[placeholder="Email"]')?.value;
            const password = document.querySelector('input[placeholder="Password"]')?.value;

            // Basic Check
            if (!email || !password) {
                alert('Please complete all fields');
                return;
            }

            const userData = { email, password };

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message); // Show succes messaje
                    console.log(result.employee); // Show employee data
                }
                else {
                    const errorData = await response.json();
                    alert(errorData.message);
                }
            } catch (error) {
                console.error('Error in the application:', error);
                alert('There was a problem connecting to the server.');
            }
        });
    }

    // Function to clean form
    function limpiarFormulario() {
        const inputs = document.querySelectorAll('.modern-form .form-input');
        inputs.forEach(input => {
            input.value = '';
        });
        
        
        // Restored password to password type  if it is visible
        if (passwordInput && passwordInput.type === 'text') {
            passwordInput.type = 'password';
            if (toggleButton) {
                toggleButton.innerHTML = `
                    <svg fill="none" viewBox="0 0 24 24" class="eye-icon">
                        <path stroke-width="1.5" stroke="currentColor"
                            d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z">
                        </path>
                        <circle stroke-width="1.5" stroke="currentColor" r="3" cy="12" cx="12"></circle>
                    </svg>
                `;
            }
        }
        
        if (inputs.length > 0) inputs[0].focus();
    }
});

