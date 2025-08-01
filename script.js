const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ──────────────── Theme-toggle logic ──────────────
class ThemeManager {
  constructor() {
    this.root = document.documentElement;
    this.button = document.getElementById('modeToggle');
    this.themes = ['system', 'dark', 'light'];
    this.icons = {
      system: `<svg aria-hidden="true" class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1"/><rect x="3" y="18" width="18" height="2" rx="1"/></svg>`,
      dark: `<svg aria-hidden="true" class="icon" viewBox="0 0 512 512"><path fill="#fff" d="M503.56,347.56c-21.88,57.2-64.25,106.79-123.17,136.7-126.07,64.01-280.15,13.7-344.16-112.37S22.54,91.74,148.6,27.73C207.51-2.18,272.54-7.13,331.64,8.96c-20.24,3.16-40.34,9.52-59.6,19.3-98.31,49.91-137.55,170.08-87.63,268.4,49.91,98.31,170.08,137.55,268.4,87.63,19.26-9.78,36.25-22.25,50.75-36.73Z"/></svg>`,
      light: `<svg aria-hidden="true" class="icon" viewBox="0 0 512 512"><path d="M512,256l-115.69-58.12 40.71-122.9-122.9 40.71L256 0l-58.12 115.69-122.9-40.71 40.71 122.9L0 256l115.69 58.12-40.71 122.9 122.9-40.71L256 512l58.12-115.69 122.9 40.71-40.71-122.9L512 256Zm-152 0c0 57.57-46.83 104.4-104.4 104.4S151.2 313.57 151.2 256 198.03 151.6 255.6 151.6 360 198.43 360 256Z"/></svg>`
    };
    
    this.init();
  }
  
  init() {
    this.apply(localStorage.getItem('theme') || 'system');
    this.button?.addEventListener('click', () => this.cycle());
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.updateLogo());
  }
  
  cycle() {
    const current = localStorage.getItem('theme') || 'system';
    const next = this.themes[(this.themes.indexOf(current) + 1) % this.themes.length];
    this.apply(next);
  }
  
  apply(theme) {
    if (theme === 'system') {
      this.root.removeAttribute('data-theme');
    } else {
      this.root.setAttribute('data-theme', theme);
    }
    
    if (this.button) {
      this.button.innerHTML = this.icons[theme];
      this.button.setAttribute('aria-label', `${theme} theme`);
    }
    
    localStorage.setItem('theme', theme);
    this.updateLogo();
  }
  
  updateLogo() {
    const logos = document.querySelectorAll('#siteLogo, #gridLogo');
    const theme = this.root.getAttribute('data-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (!theme && prefersDark);
    
    logos.forEach(logo => {
      if (logo) {
        logo.src = isDark ? 'img/White-Logo-Header.svg' : 'img/Red-Logo-Header.svg';
      }
    });
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// 3-D tilt effect for .card (Bento-Box style, responds to mouse near the card)
const maxTilt = 7; // degrees at edges
document.querySelectorAll('.scene').forEach(scene => {
  const card = scene.querySelector('.card, .photo-item');
  if (!card) return; // Skip if no card in this scene
  scene.addEventListener('mousemove', e => {
    if (card.classList.contains('pressed')) return;
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    const rotY = dx * maxTilt;
    const rotX = -dy * maxTilt;
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  scene.addEventListener('mouseleave', () => {
    if (card.classList.contains('pressed')) return;
    card.style.transform = 'rotateX(0) rotateY(0)';
  });
});
// ––––––––––––– Push-button pressed effect –––––––––––
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointerdown', () => card.classList.add('pressed'));
  const release = () => card.classList.remove('pressed');
  card.addEventListener('pointerup',   release);
  card.addEventListener('pointerleave',release);
});

// ───────────── Sticky-header glass effect ───────────
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ─────────────── Sequential pop-in animation on visible ──────────────
window.addEventListener('DOMContentLoaded', () => {
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const images = Array.from(document.querySelectorAll('.scene img'));
  let loaded = 0;

  function startPopIn() {
    const revealed = new Set();

    const observer = new IntersectionObserver((entries) => {
      // Filter only entries that are intersecting and not yet visible
      const newVisible = entries
        .filter(entry => entry.isIntersecting && !entry.target.classList.contains('visible') && !revealed.has(entry.target))
        .map(entry => entry.target);

      if (newVisible.length > 0) {
        // Pop in the first one immediately
        const first = newVisible[0];
        first.classList.add('visible');
        revealed.add(first);
        observer.unobserve(first);

        // Stagger the rest
        newVisible.slice(1).forEach((scene, i) => {
          setTimeout(() => {
            scene.classList.add('visible');
            revealed.add(scene);
            observer.unobserve(scene);
          }, (i + 1) * 100); // 100ms stagger after the first
        });
      }
    }, { threshold: 0.2 });

    scenes.forEach(scene => observer.observe(scene));
  }

  if (images.length === 0) {
    startPopIn();
  } else {
    images.forEach(img => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) startPopIn();
      } else {
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === images.length) startPopIn();
        });
        img.addEventListener('error', () => {
          loaded++;
          if (loaded === images.length) startPopIn();
        });
      }
    });
  }
});

// Contact Form Submission
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                formStatus.textContent = "Thanks for your submission!";
                form.reset();
            } else {
                let errorMsg = `Error ${response.status}: ${response.statusText}`;
                try {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        errorMsg += " - " + data["errors"].map(error => error["message"]).join(", ");
                    } else if (data.message) {
                        errorMsg += " - " + data.message;
                    }
                    formStatus.textContent = errorMsg;
                } catch {
                    formStatus.textContent = errorMsg;
                }
            }
        } catch (error) {
            formStatus.textContent = `Network error: ${error.message}`;
        }
    });
}

// Fade out main title on scroll
document.addEventListener('DOMContentLoaded', function() {
  const mainTitle = document.querySelector('.mainTitle');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const portfolioSection = document.getElementById('portfolio');
  
  // Smooth scroll for scroll indicator
  if (scrollIndicator && portfolioSection) {
    scrollIndicator.addEventListener('click', function() {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }
  
  // Fade effect on scroll
  const FADE_COMPLETE_RATIO = 0.5; // Fade completes at 50% of viewport height
  function handleScroll() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Calculate opacity based on scroll position
    // Fade starts immediately and completes at FADE_COMPLETE_RATIO of viewport height
    const opacity = Math.max(0, 1 - (scrollY / (viewportHeight * FADE_COMPLETE_RATIO)));
    
    if (mainTitle) {
      mainTitle.style.opacity = opacity;
    }
  }
  
  // Throttle scroll events for better performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }
  
  function onScroll() {
    ticking = false;
    requestTick();
  }
  
  window.addEventListener('scroll', onScroll);
  
  // Initial call
  handleScroll();
});

// Robust Masonry Grid Layout for Photos Page
function initializePhotoGrid() {
  const grid = document.querySelector('.photo-grid');
  if (!grid) return; // Exit if no grid on page

  const rowHeight = parseInt(getComputedStyle(grid).gridAutoRows);
  const rowGap = parseInt(getComputedStyle(grid).gap);

  const setItemSpan = (item) => {
    const card = item.querySelector('.card');
    if (!card) return;
    const itemHeight = card.getBoundingClientRect().height;
    const itemSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${itemSpan}`;
  };

  const layoutGrid = () => {
    grid.querySelectorAll('.scene').forEach(setItemSpan);
  };

  // Layout each item after its image loads
  const images = grid.querySelectorAll('img');
  images.forEach(img => {
    img.classList.add('loading');
    // Handle both cached and loading images
    if (img.complete) {
      setItemSpan(img.closest('.scene'));
      img.classList.remove('loading');
    } else {
      img.addEventListener('load', () => {
        setItemSpan(img.closest('.scene'));
        img.classList.remove('loading');
      }, { once: true });
    }
  });

  // Re-layout on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(layoutGrid, 100);
  });
}

// Run the function
initializePhotoGrid();

// =================================================
// Lightbox Photo Viewer Script (Global Scroll-to-Select)
// =================================================
document.addEventListener('DOMContentLoaded', () => {
  const photoGrid = document.querySelector('.photo-grid');
  if (!photoGrid) return;

  const photos = Array.from(photoGrid.querySelectorAll('.card'));
  if (photos.length === 0) return;

  // Create lightbox elements once
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  document.body.appendChild(lightbox);

  lightbox.innerHTML = `
    <div class="lightbox-container">
      <div class="lightbox-thumbnails"></div>
      <div class="lightbox-main">
        <button class="lightbox-btn lightbox-prev" aria-label="Previous image">‹</button>
        <img src="" alt="Enlarged photo" />
        <button class="lightbox-btn lightbox-next" aria-label="Next image">›</button>
      </div>
    </div>
    <button class="lightbox-btn lightbox-close" aria-label="Close viewer">&times;</button>
  `;

  const mainImage = lightbox.querySelector('.lightbox-main img');
  const thumbnailsContainer = lightbox.querySelector('.lightbox-thumbnails');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const prevBtn = lightbox.querySelector('.lightbox-prev');

  let currentIndex = -1;
  let scrollTimeout;

  // Populate thumbnails
  photos.forEach((photo, index) => {
    const imgSrc = photo.querySelector('img').src;
    const thumb = document.createElement('img');
    thumb.src = imgSrc;
    thumb.addEventListener('click', () => {
      updateMainImage(index); // Add this line
      if (window.innerWidth <= 800) {
        thumb.scrollIntoView({ 
          behavior: 'smooth', 
          inline: 'center',
          block: 'nearest'
        });
      } else {
        thumb.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    });
    thumbnailsContainer.appendChild(thumb);
  });

  const thumbnailImages = thumbnailsContainer.querySelectorAll('img');

  function updateMainImage(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    const photo = photos[currentIndex];
    const imgSrc = photo.querySelector('img').src;
    const imgAlt = photo.querySelector('img').alt;

    mainImage.src = imgSrc;
    mainImage.alt = imgAlt;

    thumbnailImages.forEach(thumb => thumb.classList.remove('active'));
    thumbnailImages[currentIndex].classList.add('active');
  }

  function findCenterThumbnail() {
    if (window.innerWidth <= 800) {
      // Mobile: Use horizontal center for horizontal thumbnail strip
      const viewportCenterX = window.innerWidth / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;

      thumbnailImages.forEach((thumb, index) => {
        const thumbRect = thumb.getBoundingClientRect();
        // Find the thumbnail's center relative to the viewport horizontally
        const thumbCenterX = thumbRect.left + thumbRect.width / 2;
        
        // Check its distance from the viewport's horizontal center
        const distance = Math.abs(viewportCenterX - thumbCenterX);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      updateMainImage(closestIndex);
    } else {
      // Desktop: Use vertical center for vertical thumbnail strip
      const viewportCenterY = window.innerHeight / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      thumbnailImages.forEach((thumb, index) => {
        const thumbRect = thumb.getBoundingClientRect();
        // Find the thumbnail's center relative to the viewport vertically
        const thumbCenterY = thumbRect.top + thumbRect.height / 2;
        
        // Check its distance from the viewport's vertical center
        const distance = Math.abs(viewportCenterY - thumbCenterY);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      updateMainImage(closestIndex);
    }
  }

  // Use requestAnimationFrame for smooth, instant selection on scroll
  let isScrolling = null;
  thumbnailsContainer.addEventListener('scroll', () => {
    if (isScrolling) {
      window.cancelAnimationFrame(isScrolling);
    }
    isScrolling = window.requestAnimationFrame(findCenterThumbnail);
  });

  // NEW: Handle global mouse wheel scrolling with mobile consideration
  function handleWheelScroll(e) {
    // Only prevent default on desktop to allow mobile touch scrolling
    if (window.innerWidth > 800) {
      e.preventDefault(); // Prevent default window scroll on desktop
      thumbnailsContainer.scrollTop += e.deltaY;
    } else {
      // On mobile, let the thumbnails container handle horizontal scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        thumbnailsContainer.scrollLeft += e.deltaX;
      }
    }
  }

  function openLightbox(index) {
    document.body.classList.add('lightbox-active'); // Disable body scroll
    lightbox.classList.add('active');
    
    // Different scroll behavior for mobile vs desktop
    if (window.innerWidth <= 800) {
      // Mobile: horizontal scroll into view
      thumbnailImages[index].scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center',
        block: 'nearest'
      });
    } else {
      // Desktop: vertical scroll into view
      thumbnailImages[index].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
    
    updateMainImage(index);
    
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('wheel', handleWheelScroll, { passive: false });
  }

  function closeLightbox() {
    document.body.classList.remove('lightbox-active'); // Re-enable body scroll
    lightbox.classList.remove('active');
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('wheel', handleWheelScroll);
  }

  function showNext() {
    const nextIndex = (currentIndex + 1) % photos.length;
    updateMainImage(nextIndex); // Add this line
    if (window.innerWidth <= 800) {
      thumbnailImages[nextIndex].scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center',
        block: 'nearest'
      });
    } else {
      thumbnailImages[nextIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  function showPrev() {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    updateMainImage(prevIndex); // Add this line
    if (window.innerWidth <= 800) {
      thumbnailImages[prevIndex].scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center',
        block: 'nearest'
      });
    } else {
      thumbnailImages[prevIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  }

  photos.forEach((photo, index) => {
    photo.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
});

// ──────────────── Hamburger Menu Logic ──────────────
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking on a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Quote Slider
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.quote-track');
  if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.quote-next');
    const prevButton = document.querySelector('.quote-prev');
    let currentIndex = 0;

    const updateSlides = () => {
      track.style.transform = 'translateX(-' + 100 * currentIndex + '%)';
    };

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    });

    // Initialize
    updateSlides();
  }
});

// Load Quotes from JSON file
function loadQuotes() {
  fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
      const track = document.querySelector('.quote-track');
      if (!track) return;

      // Clear existing slides
      track.innerHTML = '';

      data.quotes.forEach(quote => {
        const slide = document.createElement('div');
        slide.className = 'quote-slide';
        slide.innerHTML = `
          <p class="quote-text">"${quote.text}"</p>
          <p class="quote-author">— ${quote.author}</p>
        `;
        track.appendChild(slide);
      });

      // Re-initialize the slider with new slides
      initializeQuoteSlider();
    })
    .catch(error => console.error('Error loading quotes:', error));
}

// Initialize quote slider
function initializeQuoteSlider() {
  const track = document.querySelector('.quote-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.quote-next');
  const prevButton = document.querySelector('.quote-prev');
  let currentIndex = 0;

  const updateSlides = () => {
    track.style.transform = 'translateX(-' + 100 * currentIndex + '%)';
  };

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlides();
  });

  // Initialize
  updateSlides();
}

// Load quotes on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
});

// Responsive Grid Reordering - Move Mafia Cards on medium screens
document.addEventListener('DOMContentLoaded', () => {
  let resizeTimeout;
  
  function debounce(func, wait) {
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(resizeTimeout);
        func(...args);
      };
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(later, wait);
    };
  }
  
  function repositionMafiaCards() {
    const mafiaCardsScene = document.querySelector('.scene .card[href="cards.html"]')?.closest('.scene');
    const quoteBlock = document.querySelector('.quote-block-full-width');
    const portfolioContinued = document.querySelector('#portfolio-continued .grid');
    const originalGrid = document.querySelector('#portfolio .grid');
    
    if (!mafiaCardsScene || !quoteBlock || !portfolioContinued || !originalGrid) {
      console.log('Missing elements for repositioning');
      return;
    }
    
    const screenWidth = window.innerWidth;
    console.log('Screen width:', screenWidth); // Debug log

    // Move to after quote block on medium screens (601px to 1199px)
    if (screenWidth <= 1199 && screenWidth > 600) {
      console.log('Moving to portfolio-continued'); // Debug log
      // Only move if it's not already there
      if (!portfolioContinued.contains(mafiaCardsScene)) {
        portfolioContinued.insertBefore(mafiaCardsScene, portfolioContinued.firstChild);
      }
    } else {
      console.log('Moving back to original portfolio'); // Debug log
      // Move back to original position on other screen sizes
      if (!originalGrid.contains(mafiaCardsScene)) {
        originalGrid.appendChild(mafiaCardsScene);
      }
    }
  }
  
  // Initial positioning
  repositionMafiaCards();
  
  // Debounced resize handler
  const debouncedReposition = debounce(repositionMafiaCards, 150);
  window.addEventListener('resize', debouncedReposition);
  
  // Also listen for orientation change on mobile
  window.addEventListener('orientationchange', () => {
    setTimeout(repositionMafiaCards, 100);
  });
});

// Consolidate all DOMContentLoaded listeners into one
document.addEventListener('DOMContentLoaded', () => {
  // Theme and logo initialization
  updateLogo();
  
  // Photo grid initialization
  initializePhotoGrid();
  
  // Lightbox initialization
  initializeLightbox();
  
  // Quote slider initialization
  initializeQuoteSlider();
  
  // Hamburger menu initialization
  initializeHamburgerMenu();
  
  // Main title fade effect
  initializeMainTitleFade();
  
  // Grid repositioning
  initializeGridRepositioning();
  
  // Sequential pop-in animation
  initializePopInAnimation();
});

// Use modern JavaScript features more efficiently
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

// Cache DOM queries
const DOM = {
  header: $('header'),
  mainTitle: $('.mainTitle'),
  hamburger: $('#hamburger'),
  nav: $('nav'),
  photoGrid: $('.photo-grid'),
  quoteTrack: $('.quote-track')
};

// Use event delegation where possible
document.addEventListener('click', (e) => {
  if (e.target.matches('.card')) handleCardClick(e);
  if (e.target.matches('.hamburger')) handleHamburgerClick(e);
  if (e.target.matches('.quote-nav')) handleQuoteNav(e);
});

// Create a single, reusable debounce utility
function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Optimize scroll handlers
const optimizedScrollHandler = debounce(() => {
  handleHeaderScroll();
  handleMainTitleFade();
  handleScrollVideo();
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Single intersection observer for all animations
const createOptimizedObserver = (callback, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Optimize image loading
function optimizeImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = createOptimizedObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Call optimizeImages on DOMContentLoaded
document.addEventListener('DOMContentLoaded', optimizeImages);

// Quote Slider with Auto-cycling
document.addEventListener('DOMContentLoaded', () => {
  const quoteSlider = document.querySelector('.quote-slider');
  if (!quoteSlider) return;

  const quoteTrack = quoteSlider.querySelector('.quote-track');
  const quotes = quoteTrack.querySelectorAll('.quote-item');
  const prevBtn = document.querySelector('.quote-prev');
  const nextBtn = document.querySelector('.quote-next');
  const dots = document.querySelectorAll('.quote-dot');
  
  let currentIndex = 0;
  let autoSlideInterval;
  const slideInterval = 4000; // 4 seconds

  function updateSlider() {
    const translateX = -currentIndex * 100;
    quoteTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update active states for quotes
    quotes.forEach((quote, index) => {
      quote.classList.toggle('active', index === currentIndex);
    });
    
    // Update active states for dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToQuote(index) {
    currentIndex = index;
    updateSlider();
  }

  function nextQuote() {
    currentIndex = (currentIndex + 1) % quotes.length;
    updateSlider();
  }

  function prevQuote() {
    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    updateSlider();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextQuote, slideInterval);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Event listeners for navigation buttons
  nextBtn?.addEventListener('click', () => {
    nextQuote();
    resetAutoSlide();
  });

  prevBtn?.addEventListener('click', () => {
    prevQuote();
    resetAutoSlide();
  });

  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToQuote(index);
      resetAutoSlide();
    });
  });

  // Pause auto-slide when user hovers over the quote block
  quoteSlider.addEventListener('mouseenter', stopAutoSlide);
  quoteSlider.addEventListener('mouseleave', startAutoSlide);

  // Start auto-sliding
  startAutoSlide();

  // Initial setup
  updateSlider();
});