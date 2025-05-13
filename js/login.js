$(document).ready(function() {
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        
        const usernameEmail = $('#usernameEmail').val();
        const password = $('#password').val();
        
        $.ajax({
            url: 'Controller.Actions.CustomersAction', // Ajusta esta URL según tu configuración
            type: 'POST',
            data: {
                action: 'LOGIN',
                usernameEmail: usernameEmail,
                password: password
            },
            dataType: 'json',
            success: function(response) {
                if (response.message) {
                    // Error en el login
                    $('#loginMessage').removeClass('success-message').addClass('error-message').text(response.message);
                } else {
                    // Login exitoso
                    $('#loginMessage').removeClass('error-message').addClass('success-message').text('Login successful! Redirecting...');
                    
                    // Guarda los datos del usuario en sessionStorage
                    sessionStorage.setItem('currentUser', JSON.stringify(response));
                    
                    // Redirige después de 1 segundo
                    setTimeout(function() {
                        window.location.href = '../html/index.html';
                    }, 1000);
                }
            },
            error: function(xhr, status, error) {
                $('#loginMessage').removeClass('success-message').addClass('error-message').text('Error: ' + error);
            }
        });
    });
});