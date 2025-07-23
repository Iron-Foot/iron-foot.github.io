import Carousel from './src/components/carousel.js';
import Lightbox from './src/components/lightbox.js';

// Initialize the lightbox and carousel
const lightbox = new Lightbox();
const carousel = new Carousel();

// Function to handle image click
function handleImageClick(event) {
    const imgElement = event.currentTarget.querySelector('img');
    const imgSrc = imgElement.src;
    const thumbnails = Array.from(document.querySelectorAll('.photo-grid .card img')).map(img => img.src);

    lightbox.open(imgSrc, thumbnails);
}

// Add event listeners to images in the photo grid
document.querySelectorAll('.photo-grid .card').forEach(card => {
    card.addEventListener('click', handleImageClick);
});

// Event listener for closing the lightbox
document.getElementById('lightboxClose').addEventListener('click', () => {
    lightbox.close();
});

// Initialize the carousel
carousel.init();