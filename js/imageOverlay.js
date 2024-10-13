document.addEventListener('DOMContentLoaded', function() {
    const portfolioImages = document.querySelectorAll('.portfolio-item img');
    const overlay = document.createElement('div');
    overlay.classList.add('image-overlay');
    const overlayImage = document.createElement('img');
    overlay.appendChild(overlayImage);
    document.body.appendChild(overlay);

    portfolioImages.forEach(image => {
        image.addEventListener('click', function() {
            overlayImage.src = image.src;
            overlay.style.display = 'flex';
        });
    });

    overlay.addEventListener('click', function() {
        overlay.style.display = 'none';
    });
});