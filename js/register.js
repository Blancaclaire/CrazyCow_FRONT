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

    // Configurar el evento click del botón
    document.getElementById('submitBtn').addEventListener('click', function (e) {
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

        // Leer los datos del formulario
        const jobId = document.getElementById('job_id').value;
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phone_number').value;
        const address = document.getElementById('address').value;
        const applicationDate = document.getElementById('application_date').value;

        // Obtener el archivo del CV (solo información básica ya que localStorage no almacena archivos)
        const resumeFile = document.getElementById('resume').files[0];
        const resumeInfo = resumeFile ? {
            name: resumeFile.name,
            type: resumeFile.type,
            size: resumeFile.size
        } : null;

        // Generar un ID único para el aplicante
        const applicantId = 'applicant-' + Date.now();

        // Crear objeto con los datos del aplicante
        const applicant = {
            applicant_id: applicantId,
            job_id: jobId,
            name: name,
            surname: surname,
            email: email,
            phone_number: phoneNumber,
            address: address,
            resume: resumeInfo,
            application_date: applicationDate,
            timestamp: new Date().toISOString()
        };

        // Almacenar en localStorage
        saveApplicant(applicant);

        // Redirigir a la página de confirmación
        window.location.href = '../html/job-aplication.html';
    });

    // Función para guardar el aplicante en localStorage
    function saveApplicant(applicant) {
        // Obtener aplicantes existentes o inicializar array vacío
        let applicants = JSON.parse(localStorage.getItem('jobApplicant')) || [];

        // Agregar nuevo aplicante
        applicants.push(applicant);

        // Guardar en localStorage
        localStorage.setItem('jobApplicant', JSON.stringify(applicants));
    }
});