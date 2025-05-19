
document.addEventListener('DOMContentLoaded', function() {
    // Configurar fecha actual
    document.getElementById('application_date').valueAsDate = new Date();

    document.getElementById('submitBtn').onclick = async function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const formData = {
            ACTION: 'APPLICANT.ADD',
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            email: document.getElementById('email').value,
            phone_number: document.getElementById('phone_number').value,
            address: document.getElementById('address').value,
            job_offer_id: '1',
            application_date: document.getElementById('application_date').value
        };

        // 
        const resumeFile = document.getElementById('resume').files[0];
        if (!resumeFile) {
            alert('Debes subir tu currículum');
            return;
        }
        formData.resume = resumeFile.name; // Nombre del archivo

        try {
            
            const response = await fetch('http://localhost:8080/api/Controller', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            });
            
            const result = await response.text();
            console.log('Respuesta del servidor:', result);
            
            if (result.includes('ERROR')) {
                throw new Error(result);
            }
            
            alert('¡Solicitud enviada con éxito!');
            document.getElementById('jobApplicationForm').reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar: ' + error.message);
        }
    };
});

