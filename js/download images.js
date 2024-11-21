// Function to preload an image
function preloadImage(url) {
    const img = new Image();
    img.src = url;
}

// Attach event listeners to each link
const links = document.querySelectorAll('a[data-image]');
links.forEach(link => {
    const imageUrl = link.getAttribute('data-image');
    link.addEventListener('mouseenter', () => preloadImage(imageUrl));
});
