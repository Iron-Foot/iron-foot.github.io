    const circlePointer = document.getElementById('circlePointer');
    let isWhiteStyle = false;

    document.addEventListener('DOMContentLoaded', function() {
        const linkTags = document.getElementsByTagName('link');
        for (let link of linkTags) {
            if (link.href && link.href.includes('stylesWhite.css')) {
                isWhiteStyle = true;
                circlePointer.style.backgroundColor = '#000';
            }
        }
    });

    document.addEventListener('mousemove', function(e) {
        window.requestAnimationFrame(() => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            circlePointer.style.left = `${mouseX}px`;
            circlePointer.style.top = `${mouseY}px`;
        });
    });

    document.addEventListener('mouseover', function(e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || (e.target.hasAttribute('role') && e.target.getAttribute('role') === 'button') || e.target.type === 'button' || e.target.type === 'submit' || e.target.classList.contains('portfolio-item') || e.target.closest('.portfolio-item img')) {
            circlePointer.style.width = '40px';
            circlePointer.style.height = '40px';
            circlePointer.style.backgroundColor = isWhiteStyle ? '#000' : '#fff';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || (e.target.hasAttribute('role') && e.target.getAttribute('role') === 'button') || e.target.type === 'button' || e.target.type === 'submit' || e.target.classList.contains('portfolio-item') || e.target.closest('.portfolio-item img')) {
            circlePointer.style.width = '20px';
            circlePointer.style.height = '20px';
            circlePointer.style.backgroundColor = isWhiteStyle ? '#000' : '#fff';
        }
    });