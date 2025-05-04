// Función para controlar el menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('overlay');

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic en el overlay
    overlay.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Cerrar el menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-button');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    });
});