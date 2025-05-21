document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('service_qt01eza', 'template_n9najab', this)
        .then(function() {
            alert('Thank you! Your message has been sent.');
        }, function(error) {
            alert('Oops! Something went wrong.\n' + JSON.stringify(error));
        });

    this.reset();
});
