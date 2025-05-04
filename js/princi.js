// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Get the necessary elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-container ul');
    const overlayBg = document.getElementById('overlayBg');
    
    // Toggle the navigation menu when the hamburger button is clicked
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlayBg.classList.toggle('active');
    });
    
    // Close the menu when clicking on the overlay background
    overlayBg.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        overlayBg.classList.remove('active');
    });
    
    // Close the menu when clicking on a menu item
    const navLinks = document.querySelectorAll('.nav-button');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlayBg.classList.remove('active');
        });
    });
    
    // Close the menu when clicking on the basket button
    const basketButton = document.querySelector('.basket-button');
    if (basketButton) {
        basketButton.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlayBg.classList.remove('active');
        });
    }
    
    // Close the menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlayBg.classList.remove('active');
        }
    });
});