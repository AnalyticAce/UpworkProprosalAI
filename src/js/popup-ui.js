// Handle the animation and status UI
document.addEventListener('DOMContentLoaded', function() {
    // Animate the pulse effect for the status
    setInterval(() => {
        const pulse = document.querySelector('.pulse');
        pulse.style.animation = 'none';
        setTimeout(function() {
            pulse.style.animation = '';
        }, 10);
    }, 3000);
    
    // Add hover effect to the icon
    const icon = document.querySelector('.header-icon');
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(5deg)';
    });
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0)';
    });
});
