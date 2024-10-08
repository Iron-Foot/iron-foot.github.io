document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.fadein');
  
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 150); // Adjust the delay (300 ms) for the desired effect
    });
  });
  