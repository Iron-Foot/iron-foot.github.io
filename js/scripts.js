// JavaScript to handle form submission (same as before)
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    alert(`Thank you, ${name}! Your message has been received.\n\nEmail: ${email}\nMessage: ${message}`);

    // Optionally, reset the form after submission
    this.reset();
});


