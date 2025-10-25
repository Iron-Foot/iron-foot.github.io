// =================================================
// TABLE OF CONTENTS
// =================================================
/*
1. UTILITIES & HELPERS
   - Year Update
   - Debounce Function
   - DOM Query Shortcuts ($, $$)
   - DOM Cache Object

2. THEME MANAGEMENT
   - ThemeManager Class
   - Theme Toggle Logic
   - Logo Updates (Dark/Light)

3. CARD INTERACTIONS
   - 3D Tilt Effects
   - Push-button Pressed Effects

4. HEADER & NAVIGATION
   - Sticky Header Glass Effect
   - Hamburger Menu Logic
   - Mobile Menu Handling

5. ANIMATIONS & VISUAL EFFECTS
   - Sequential Pop-in Animation
   - Main Title Fade on Scroll
   - Intersection Observer Setup

6. PHOTO GRID & MASONRY
   - Photo Grid Layout (Pinterest-style)
   - Responsive Grid Repositioning
   - Image Loading Optimization

7. LIGHTBOX VIEWER
   - Global Lightbox Photo Viewer
   - Scroll-to-Select Navigation
   - Keyboard & Touch Controls

8. QUOTE SLIDER
   - Auto-cycling Quote Slider
   - Navigation Dots
   - Manual Controls & Auto-pause

9. FORM HANDLING
   - Contact Form Submission
   - Error Handling & Status Updates

10. PERFORMANCE OPTIMIZATION
    - Optimized Scroll Handlers
    - Image Lazy Loading
    - Event Delegation
*/
// =================================================
// 1. UTILITIES & HELPERS
// =================================================
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

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

// =================================================
// 2. THEME MANAGEMENT
// =================================================
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

// =================================================
// 3. CARD INTERACTIONS
// =================================================
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

// Push-button pressed effect
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointerdown', () => card.classList.add('pressed'));
  const release = () => card.classList.remove('pressed');
  card.addEventListener('pointerup',   release);
  card.addEventListener('pointerleave',release);
});

// =================================================
// 4. HEADER & NAVIGATION
// =================================================
// Sticky-header glass effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Hamburger Menu Logic
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

// =================================================
// 5. ANIMATIONS & VISUAL EFFECTS
// =================================================
// Sequential pop-in animation on visible
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

// =================================================
// 6. PHOTO GRID & MASONRY
// =================================================
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

// =================================================
// 7. LIGHTBOX VIEWER
// =================================================
// Enhanced Lightbox Photo Viewer Script (Works on multiple page types)
document.addEventListener('DOMContentLoaded', () => {
  // Look for either photo-grid or project-gallery
  const photoGrid = document.querySelector('.photo-grid');
  const projectGallery = document.querySelector('.project-gallery');
  
  const container = photoGrid || projectGallery;
  if (!container) return; // Exit if neither exists

  const photos = Array.from(container.querySelectorAll('.card'));
  if (photos.length === 0) return;

  // Check if lightbox already exists in HTML, otherwise create it
  let lightbox = document.querySelector('.lightbox');
  
  if (!lightbox) {
    lightbox = document.createElement('div');
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
      <button class="lightbox-btn lightbox-close" aria-label="Close viewer">×</button>
    `;
  }

  const mainImage = lightbox.querySelector('.lightbox-main img');
  const thumbnailsContainer = lightbox.querySelector('.lightbox-thumbnails');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const prevBtn = lightbox.querySelector('.lightbox-prev');

  let currentIndex = -1;

  // Clear existing thumbnails (in case of re-initialization)
  thumbnailsContainer.innerHTML = '';

  // Populate thumbnails
  photos.forEach((photo, index) => {
    const imgSrc = photo.querySelector('img').src;
    const thumb = document.createElement('img');
    thumb.src = imgSrc;
    thumb.addEventListener('click', () => {
      updateMainImage(index);
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
      // Mobile: Use horizontal center
      const viewportCenterX = window.innerWidth / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;

      thumbnailImages.forEach((thumb, index) => {
        const thumbRect = thumb.getBoundingClientRect();
        const thumbCenterX = thumbRect.left + thumbRect.width / 2;
        const distance = Math.abs(viewportCenterX - thumbCenterX);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      updateMainImage(closestIndex);
    } else {
      // Desktop: Use vertical center
      const viewportCenterY = window.innerHeight / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      thumbnailImages.forEach((thumb, index) => {
        const thumbRect = thumb.getBoundingClientRect();
        const thumbCenterY = thumbRect.top + thumbRect.height / 2;
        const distance = Math.abs(viewportCenterY - thumbCenterY);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      updateMainImage(closestIndex);
    }
  }

  let isScrolling = null;
  thumbnailsContainer.addEventListener('scroll', () => {
    if (isScrolling) {
      window.cancelAnimationFrame(isScrolling);
    }
    isScrolling = window.requestAnimationFrame(findCenterThumbnail);
  });

  function handleWheelScroll(e) {
    if (window.innerWidth > 800) {
      e.preventDefault();
      thumbnailsContainer.scrollTop += e.deltaY;
    } else {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        thumbnailsContainer.scrollLeft += e.deltaX;
      }
    }
  }

  function openLightbox(index) {
    document.body.classList.add('lightbox-active');
    lightbox.classList.add('active');
    
    if (window.innerWidth <= 800) {
      thumbnailImages[index].scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center',
        block: 'nearest'
      });
    } else {
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
    document.body.classList.remove('lightbox-active');
    lightbox.classList.remove('active');
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('wheel', handleWheelScroll);
  }

  function showNext() {
    const nextIndex = (currentIndex + 1) % photos.length;
    updateMainImage(nextIndex);
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
    updateMainImage(prevIndex);
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

  // Add event listeners for all interactive elements
  photos.forEach((photo, index) => {
    photo.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  
  // Navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', showNext);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', showPrev);
  }

  // Click background to close - THIS IS THE KEY FIX
  lightbox.addEventListener('click', (e) => {
    // Check if click is directly on lightbox background (not on children)
    if (e.target === lightbox || e.target.classList.contains('lightbox')) {
      closeLightbox();
    }
  });
});

// =================================================
// 8. QUOTE SLIDER
// =================================================
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

// =================================================
// 9. FORM HANDLING
// =================================================
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

// =================================================
// 10. PERFORMANCE OPTIMIZATION
// =================================================
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

// Optimize scroll handlers
const optimizedScrollHandler = debounce(() => {
  handleHeaderScroll();
  handleMainTitleFade();
  handleScrollVideo();
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Use event delegation where possible
document.addEventListener('click', (e) => {
  if (e.target.matches('.card')) handleCardClick(e);
  if (e.target.matches('.hamburger')) handleHamburgerClick(e);
  if (e.target.matches('.quote-nav')) handleQuoteNav(e);
});