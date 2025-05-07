
addEventListener("DOMContentLoaded", function () {


  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Toggle active button
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // Show related content
      const target = button.dataset.target;
      contents.forEach(content => {
        content.classList.remove("active");
        if (content.id === target) {
          content.classList.add("active");
        }
      });
    });
  });
});

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

