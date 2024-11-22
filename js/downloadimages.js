// Function to preload images
function preloadImages(urls) {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  // Fetch image URLs from the JSON file
  async function fetchImageUrls(page) {
    try {
      const response = await fetch('/data/images.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data[page] || [];
    } catch (error) {
      console.error('Failed to fetch image URLs:', error);
      return [];
    }
  }

  // Preload images on link hover
  document.querySelectorAll('.preload-link').forEach(link => {
    link.addEventListener('mouseenter', async () => {
      const page = link.getAttribute('href');
      const imageUrls = await fetchImageUrls(page);
      preloadImages(imageUrls);
    });
  });