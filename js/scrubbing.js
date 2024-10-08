const section = document.querySelector('section.vid');
const vid = section.querySelector('video');

vid.pause();

// Throttle function to limit the frequency of scroll event handling
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

let sectionOffsetTop = section.offsetTop;
let sectionHeight = section.clientHeight;
let windowHeight = window.innerHeight;

const scroll = () => {
  window.requestAnimationFrame(() => {
    const distance = window.scrollY - sectionOffsetTop;
    const total = sectionHeight - windowHeight;

    let percentage = distance / total;
    percentage = Math.max(0, percentage);
    percentage = Math.min(percentage, 1);

    if (vid.duration > 0) {
      vid.currentTime = vid.duration * percentage;
    }
  });
}

// Apply throttling to the scroll event
window.addEventListener('scroll', throttle(scroll, 50));

// Update cached values on resize
window.addEventListener('resize', () => {
  sectionOffsetTop = section.offsetTop;
  sectionHeight = section.clientHeight;
  windowHeight = window.innerHeight;
});