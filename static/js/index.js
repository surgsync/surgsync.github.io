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

  /* ---- Close Mobile Menu on Link Click ----
     On single-page sites, tapping a nav link should close the menu
     so the user can see the section they navigated to. Without this,
     the menu stays open and obscures the content. */
  $(".navbar-menu .navbar-item").click(function () {
    if ($(".navbar-burger").is(":visible")) {
      $(".navbar-burger").removeClass("is-active");
      $(".navbar-menu").removeClass("is-active");
    }
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

  /* ---- Mobile Video Preload Optimization ----
     On mobile connections, defer video preloading until the user scrolls
     near the toolbox section. This reduces initial page weight significantly
     (videos are one of the heaviest resources on the page).
     On desktop, videos preload normally via the browser's default behavior. */
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.toolbox-video').forEach(function (video) {
      video.setAttribute('preload', 'none');
    });
  }

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
