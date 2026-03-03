/* ================================================================
   SurgSync Website — Custom JavaScript
   Initializes Bulma carousel, slider, navbar burger, and handles
   toolbox video placeholder fallback.
   ================================================================ */

window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function () {

  /* ---- Navbar Burger (mobile menu toggle) ----
     Bulma requires manually toggling is-active on the burger and menu. */
  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  /* ---- Initialize Bulma Carousels ----
     Any element with class="carousel" on the page will be initialized.
     Adjust slidesToShow for the number of items visible at once. */
  var carouselOptions = {
    slidesToScroll: 1,
    slidesToShow: 3,   /* number of items visible simultaneously */
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  var carousels = bulmaCarousel.attach('.carousel', carouselOptions);

  /* ---- Initialize Bulma Sliders ----
     Handles any <input type="range"> with class="slider". */
  bulmaSlider.attach();

  /* ---- Toolbox Video Placeholder Handling ----
     Strategy: for every .toolbox-video element, insert a "Coming Soon"
     placeholder immediately on DOM-ready and hide the video element.
     The video is only revealed if it actually receives data (loadeddata event).

     This approach is more reliable than timeout-based or error-event-based
     detection because:
       - No black-box flash (video is hidden from the start)
       - No race condition with 404 response timing
       - Works correctly even for the stacked PSM1/PSM2 layout
  */
  document.querySelectorAll('.toolbox-video').forEach(function (video) {
    var fig = video.closest('figure');
    if (!fig) return;

    /* Read the caption text to use as the placeholder label */
    var captionEl = fig.querySelector('figcaption');
    var caption = captionEl ? captionEl.textContent.trim() : 'Video';

    /* Read the source path to display in the placeholder */
    var srcEl = video.querySelector('source');
    var src = srcEl ? srcEl.getAttribute('src') : '';

    /* Build the "Coming Soon" placeholder div */
    var ph = document.createElement('div');
    ph.className = 'placeholder-figure toolbox-video-placeholder';
    ph.style.minHeight = '185px';
    ph.innerHTML =
      '<p style="font-size:1.6rem;margin-bottom:0.4rem">🎥</p>' +
      '<p style="font-weight:600;margin-bottom:0.2rem">' + caption + '</p>' +
      '<p style="font-size:0.78rem;color:#aaa;margin-top:0.3rem">Coming soon</p>' +
      (src
        ? '<p style="font-size:0.7rem;color:#ccc;margin-top:0.2rem"><code>' + src + '</code></p>'
        : '');

    /* Insert placeholder before the video and hide the video immediately.
       The placeholder is visible by default; the video is hidden until ready. */
    fig.insertBefore(ph, video);
    video.style.display = 'none';

    /* Reveal the video (and hide placeholder) only when actual data is loaded.
       loadeddata fires once the browser has enough data to play at least one frame. */
    video.addEventListener('loadeddata', function () {
      ph.style.display = 'none';
      video.style.display = 'block';
    });
  });

});
