function updateProjectNames() {
    const projectNames = document.querySelectorAll('.project-name');
    const isDesktop = window.innerWidth >= 768; // Adjust the width as needed for your breakpoint

    projectNames.forEach(projectName => {
        const text = projectName.textContent.replace(/\s+/g, ' ').trim();
        if (isDesktop) {
            projectName.innerHTML = text.replace(' ', '&nbsp;');
        } else {
            projectName.textContent = text.replace('&nbsp;', ' ');
        }
    });
}

// Initial check
updateProjectNames();

// Update on window resize
window.addEventListener('resize', updateProjectNames);