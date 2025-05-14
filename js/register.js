document.addEventListener('DOMContentLoaded', function () {
    // Establecer fecha actual por defecto
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    document.getElementById('application_date').value = `${yyyy}-${mm}-${dd}`;

    // Manejar el envío del formulario
    const form = document.getElementById('jobApplicationForm');
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'none'; // Ocultar mensaje inicialmente

    // Configurar el evento click del botón
    document.getElementById('submitBtn').addEventListener('click', async function (e) {
        e.preventDefault();

        // Validar el formulario
        const allInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        allInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Please complete all required fields');
            return;
        }

        // Mostrar indicador de carga
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Leer los datos del formulario
            const name = document.getElementById('name').value;
            const surname = document.getElementById('surname').value;
            const email = document.getElementById('email').value;
            const phoneNumber = document.getElementById('phone_number').value;
            const address = document.getElementById('address').value;
            const applicationDate = document.getElementById('application_date').value;
            const resumeFile = document.getElementById('resume').files[0];

            // Crear objeto con los datos (sin job_id)
            const applicantData = {
                ACTION: 'APPLICANT.ADD', // Corregí APPLICANT
                name: name,
                surname: surname,
                email: email,
                phone_number: phoneNumber,
                address: address,
                aplication_date: applicationDate
            };

            // Opción 1: Enviar sin archivo (más simple)
            let response;
            if (!resumeFile) {
                response = await fetch('http://localhost:8080/CrazyCow_Server/Controller', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(applicantData)
                });
            } 
            // Opción 2: Enviar con archivo (FormData)
            else {
                const formData = new FormData();
                for (const key in applicantData) {
                    formData.append(key, applicantData[key]);
                }
                formData.append('resume', resumeFile);
                
                response = await fetch('http://localhost:8080/CrazyCow_Server/Controller', {
                    method: 'POST',
                    body: formData
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            console.log('Success:', result);
            
            // Mostrar mensaje de éxito
            successMessage.style.display = 'block';
            form.reset();
            
            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Error submitting application: ${error.message}`);
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Application';
        }
    });
});