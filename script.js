const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ──────────────── Theme-toggle logic ──────────────
const root       = document.documentElement;
const button     = document.getElementById('modeToggle');
const ORDER      = ['system', 'dark', 'light'];       // cycle order

const icons = {
  system: `<svg aria-hidden="true" class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1"/><rect x="3" y="18" width="18" height="2" rx="1"/></svg>`,
  dark:   `<svg aria-hidden="true" class="icon" viewBox="0 0 512 512"><path fill="#fff" d="M503.56,347.56c-21.88,57.2-64.25,106.79-123.17,136.7-126.07,64.01-280.15,13.7-344.16-112.37S22.54,91.74,148.6,27.73C207.51-2.18,272.54-7.13,331.64,8.96c-20.24,3.16-40.34,9.52-59.6,19.3-98.31,49.91-137.55,170.08-87.63,268.4,49.91,98.31,170.08,137.55,268.4,87.63,19.26-9.78,36.25-22.25,50.75-36.73Z"/></svg>`,
  light:  `<svg aria-hidden="true" class="icon" viewBox="0 0 512 512"><path d="M512,256l-115.69-58.12 40.71-122.9-122.9 40.71L256 0l-58.12 115.69-122.9-40.71 40.71 122.9L0 256l115.69 58.12-40.71 122.9 122.9-40.71L256 512l58.12-115.69 122.9 40.71-40.71-122.9L512 256Zm-152 0c0 57.57-46.83 104.4-104.4 104.4S151.2 313.57 151.2 256 198.03 151.6 255.6 151.6 360 198.43 360 256Z"/></svg>`
};

function updateLogo() {
  const headerLogo = document.getElementById('siteLogo');
  const gridLogo = document.getElementById('gridLogo');
  const theme = document.documentElement.getAttribute('data-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (!theme && prefersDark);

  if (headerLogo) {
    headerLogo.src = isDark ? 'img/White-Logo-Header.svg' : 'img/Red-Logo-Header.svg';
  }
  if (gridLogo) {
    gridLogo.src = isDark ? 'img/White-Logo-Header.svg' : 'img/Red-Logo-Header.svg';
  }
}

// Call updateLogo after theme changes and on load
window.addEventListener('DOMContentLoaded', updateLogo);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogo);

// Call after theme is applied
function apply(theme) {
  if (theme === 'system') {
    root.removeAttribute('data-theme');
    button.innerHTML = icons.system;
    button.setAttribute('aria-label', 'System theme');
  } else {
    root.setAttribute('data-theme', theme);
    button.innerHTML = theme === 'dark' ? icons.dark : icons.light;
    button.setAttribute('aria-label', `${theme} theme`);
  }
  localStorage.setItem('theme', theme);
  updateLogo(); // <-- Add this line
}

button.addEventListener('click', () => {
  const current = localStorage.getItem('theme') || 'system';
  const next    = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  apply(next);
});

// initial load
apply(localStorage.getItem('theme') || 'system');
window.addEventListener('DOMContentLoaded', updateLogo);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogo);

// 3-D tilt effect for .card (Bento-Box style, responds to mouse near the card)
const maxTilt = 7; // degrees at edges
document.querySelectorAll('.scene').forEach(scene => {
  const card = scene.querySelector('.card');
  scene.addEventListener('mousemove', e => {
    // Disable tilt if card is pressed
    if (card.classList.contains('pressed')) return;
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    const rotY = dx * maxTilt; // horizontal
    const rotX = -dy * maxTilt; // vertical
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  scene.addEventListener('mouseleave', () => {
    // Disable tilt reset if card is pressed
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