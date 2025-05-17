addEventListener('DOMContentLoaded', function () {
    const contenedor = document.getElementById('contenedor');

    const url = 'http://localhost:8080/CrazyCow_Server/Controller?ACTION=APPLICANT.FIND_ALL';
    const baseUrl = '/imagenes/';

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error al conectar con el servidor');
            return response.json();
        })
        .then(applicants => {
            applicants.forEach(applicant => {

                 const resumeFullPath = applicant.resume || '';
                
                // Extraer solo el nombre del archivo (sin la ruta)
                const resumeFile = resumeFullPath.split('/').pop().split('\\').pop();
                const src = `${baseUrl}${resumeFile}`;

                const div = document.createElement('div');
                div.classList.add('applicant');
                div.innerHTML = `
                        <h2>${applicant.name} ${applicant.surname}</h2>
                        <p><strong>Email:</strong> ${applicant.email}</p>
                        <p><strong>Teléfono:</strong> ${applicant.phone_number}</p>
                        <p><strong>Dirección:</strong> ${applicant.address}</p>
                        <p><strong>Puesto solicitado:</strong> ${applicant.job_title}</p>
                        <p><strong>Currículum:</strong> <a href="${src}" target="_blank">${resumeFile}</a></p>
                    `;
                contenedor.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            contenedor.innerHTML = '<p>Error al cargar los datos.</p>';
        });

});