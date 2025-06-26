<script type="module">
/* 1.  Wipe any stray overlays every time this document is shown
   ------------------------------------------------------------ */
function removeTransitionOverlays () {
  document.querySelectorAll('[data-route-overlay]').forEach(el => el.remove());
}

window.addEventListener('pageshow',   removeTransitionOverlays); // coming **from** BFCache
window.addEventListener('DOMContentLoaded', removeTransitionOverlays); // normal load

/* 2.  Link-click transition effect
   -------------------------------- */
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();                       // (only needs to be called once)

    /* ----  circle setup  ---- */
    const size   = Math.max(innerWidth, innerHeight) * 3;
    const color  = link.closest('nav') ? '#000' : '#fff';

    const svgNS  = 'http://www.w3.org/2000/svg';
    const svg    = document.createElementNS(svgNS, 'svg');
    const circle = document.createElementNS(svgNS, 'circle');

    svg.dataset.routeOverlay = '';            // magic flag for later clean-up
    Object.assign(svg.style, {
      position: 'fixed', inset: 0, zIndex: 2000,
      width: '100%', height: '100%', pointerEvents: 'none'
    });

    circle.setAttribute('cx', e.clientX);
    circle.setAttribute('cy', e.clientY);
    circle.setAttribute('r', 5);
    circle.setAttribute('fill', color);
    circle.style.transition = 'r 1.5s ease-out';

    svg.append(circle);
    document.body.append(svg);

    /* trigger the animation */
    void circle.getBoundingClientRect();
    circle.setAttribute('r', size / 2);

    /* after the animation, navigate away */
    setTimeout(() => {
      window.location.href = link.href;
    }, 1000);
  });
});
</script>