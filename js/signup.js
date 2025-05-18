document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.modern-form');
    const notification = document.createElement('div');
    notification.className = 'form-notification';
    form.appendChild(notification);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        
        const submitBtn = form.querySelector('.submit-button');
        submitBtn.disabled = true;
        submitBtn.querySelector('.button-text').textContent = 'Processing...';
        notification.textContent = '';
        notification.className = 'form-notification';

        // form values
        const formData = {
            ACTION: 'CUSTOMER.REGISTER',
            name: form.querySelector('input[placeholder="Name"]').value,
            surname: form.querySelector('input[placeholder="Surname"]').value,
            email: form.querySelector('input[placeholder="Email"]').value,
            phone_number: form.querySelector('input[placeholder="Phone number"]').value,
            user_name: form.querySelector('input[placeholder="Username"]').value,
            password: form.querySelector('input[placeholder="Password"]').value,
            address: form.querySelector('input[placeholder="Address"]').value
        };

        try {
            
            const params = new URLSearchParams(formData);
            const url = `http://localhost:8080/CrazyCow_Server/Controller?${params.toString()}`;
            
            
            const response = await fetch(url, { method: 'POST' });
            const result = await response.text();
            
            if (!response.ok || result.includes('ERROR')) {
                throw new Error(result || 'Registration failed');
            }

            // Notificacion exito
            notification.textContent = 'Registration successful! Welcome to CrazyCow.';
            notification.classList.add('success');
            form.reset();

            // Redirige a la pagina de login
            setTimeout(() => {
                window.location.href = '../html/login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            notification.textContent = error.message.includes('ERROR') ? 
                error.message.replace('ERROR. ', '') : 
                'Registration failed. Please try again.';
            notification.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.button-text').textContent = 'Create Account';
        }
    });
});