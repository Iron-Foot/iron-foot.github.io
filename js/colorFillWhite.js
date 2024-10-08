document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        event.preventDefault();
        // Change the size of the circles by modifying the 'size' variable below
        const size = Math.max(window.innerWidth, window.innerHeight) * 3;
        // Change the color of the circles by modifying the 'randomColor' variable below
        let circleColor;
        if (link.closest('nav')) {
            circleColor = '#E51D30'; // Red for navigation links
        } else {
            circleColor = '#fff'; // White for other links
        }
        
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        const circle = document.createElementNS(svgNS, "circle");
        
        svg.style.position = "fixed";
        svg.style.zIndex = "2000";
        svg.style.left = "0";
        svg.style.top = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";

        circle.setAttribute("cx", event.clientX);
        circle.setAttribute("cy", event.clientY);
        circle.setAttribute("r", 5);
        circle.setAttribute("fill", circleColor);
        circle.style.transition = 'r 1.5s ease-out';

        svg.appendChild(circle);
        document.body.appendChild(svg);
        
        // Force a reflow to restart the transition
        void circle.getBoundingClientRect();

        circle.setAttribute("r", size / 2);

        // Remove the previous SVG after animation
        setTimeout(() => {
            if (svg.previousSibling) {
                svg.previousSibling.remove();
            }
            window.location = link.href;
        }, 1000);
    });
});