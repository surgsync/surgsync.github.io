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

  /* ---- Toolbox Video Loading & Placeholder Handling ----

     PROBLEM SOLVED: Videos have `autoplay` in the HTML, so the browser
     starts fetching them during HTML parsing — often BEFORE this JS runs.
     If `loadeddata` fires before we attach our listener, the video stays
     hidden forever behind the placeholder.  Refreshing "fixes" it only
     because timing shifts with cached resources.

     FIX: After attaching the listener, immediately check video.readyState.
     readyState >= 2 (HAVE_CURRENT_DATA) means `loadeddata` has already
     fired, so we reveal the video right away.  We also listen on `<source>`
     error events (not `<video>` error) because that's where 404s surface
     when using <source> children.

     MOBILE OPTIMIZATION: Instead of a blanket `preload="none"` (which
     prevents videos from loading at all — even real ones), we use
     IntersectionObserver to defer loading until the toolbox section is
     near the viewport.  This saves bandwidth on initial load while still
     loading videos when the user scrolls down.
  */

  /* Helper: reveal a video and hide its placeholder */
  function revealVideo(video, placeholder) {
    placeholder.style.display = 'none';
    video.style.display = 'block';
  }

  /* Helper: build a "Coming Soon" placeholder for a missing video */
  function buildPlaceholder(caption, src) {
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
    return ph;
  }

  var isMobile = window.innerWidth <= 768;

  document.querySelectorAll('.toolbox-video').forEach(function (video) {
    var fig = video.closest('figure');
    if (!fig) return;

    /* Read caption and source for the placeholder */
    var captionEl = fig.querySelector('figcaption');
    var caption = captionEl ? captionEl.textContent.trim() : 'Video';
    var srcEl = video.querySelector('source');
    var src = srcEl ? srcEl.getAttribute('src') : '';

    /* Create and insert placeholder; hide the video until data arrives */
    var ph = buildPlaceholder(caption, src);
    fig.insertBefore(ph, video);
    video.style.display = 'none';

    /* --- Case 1: Video already loaded (race condition fix) ---
       readyState >= 2 means HAVE_CURRENT_DATA — the browser already
       has at least one frame.  This happens when:
         - The video is cached from a previous visit
         - The file is small and loaded before DOMContentLoaded
         - The browser aggressively prefetched the resource */
    if (video.readyState >= 2) {
      revealVideo(video, ph);
      return;  /* done — no need for listeners */
    }

    /* --- Case 2: Video is still loading — attach listeners ---
       Listen for BOTH loadeddata and canplay for maximum browser
       compatibility (some mobile browsers skip loadeddata in edge cases). */
    var revealed = false;
    function onVideoReady() {
      if (revealed) return;  /* prevent double-trigger */
      revealed = true;
      revealVideo(video, ph);
    }

    video.addEventListener('loadeddata', onVideoReady);
    video.addEventListener('canplay', onVideoReady);

    /* --- Case 3: Video file doesn't exist (404) ---
       Error events for <source>-based videos fire on the <source> element,
       NOT the <video> element.  If the source fails, the placeholder stays
       visible (which is the correct "Coming Soon" behavior). */
    if (srcEl) {
      srcEl.addEventListener('error', function () {
        /* Placeholder is already visible — nothing to do.
           Pause the video element to stop any further loading attempts. */
        video.pause();
        video.removeAttribute('autoplay');
      });
    }
  });

  /* ---- Mobile: Lazy-load videos via IntersectionObserver ----
     On mobile, defer actual video loading until the toolbox section
     scrolls near the viewport.  This saves bandwidth on initial page
     load without permanently preventing videos from loading (which
     the previous preload="none" approach did).

     Strategy: set preload="none" initially, then restore "auto" and
     trigger load() when the section enters the viewport margin. */
  if (isMobile && 'IntersectionObserver' in window) {
    var toolboxSection = document.getElementById('toolbox');
    if (toolboxSection) {
      var videos = toolboxSection.querySelectorAll('.toolbox-video');

      /* Only apply lazy-loading if videos haven't loaded yet */
      var unloadedVideos = [];
      videos.forEach(function (v) {
        if (v.readyState < 2) {
          v.setAttribute('preload', 'none');
          v.pause();
          unloadedVideos.push(v);
        }
      });

      if (unloadedVideos.length > 0) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              /* Toolbox is near the viewport — start loading all videos */
              unloadedVideos.forEach(function (v) {
                v.setAttribute('preload', 'auto');
                v.load();  /* restart loading with the new preload value */
              });
              observer.disconnect();  /* only need to trigger once */
            }
          });
        }, {
          /* Start loading when the section is within 300px of the viewport,
             giving the browser a head start before the user scrolls to it */
          rootMargin: '300px'
        });

        observer.observe(toolboxSection);
      }
    }
  }

});
