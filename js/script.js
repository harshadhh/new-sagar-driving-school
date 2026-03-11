/* ================================================================
   NEW SAGAR DRIVING SCHOOL — script.js

   Class conventions (must match style.css):
     .nav-open  → mobile nav drawer is open  (on #main-nav)
     .open      → hamburger X animation      (on #hamburger)
     .dd-open   → mobile dropdown is open    (on .has-dropdown)
     .fab-visible → WhatsApp FAB is visible  (on #wa-fab)
     .reveal / .visible → scroll animations  (on cards etc.)
================================================================ */

(function () {
  'use strict';

  /* ── Element references ── */
  var hamburger = document.getElementById('hamburger');
  var mainNav   = document.getElementById('main-nav');
  var fab       = document.getElementById('wa-fab');

  /* ================================================================
     1. MOBILE NAV DRAWER
  ================================================================ */

  /** Close nav drawer and reset all state */
  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove('nav-open');
    document.body.style.overflow = '';
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    /* also close any open mobile dropdowns */
    mainNav.querySelectorAll('.has-dropdown.dd-open').forEach(function (el) {
      el.classList.remove('dd-open');
    });
  }

  if (hamburger && mainNav) {

    /* Hamburger click — toggle drawer */
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var opening = !mainNav.classList.contains('nav-open');
      if (opening) {
        mainNav.classList.add('nav-open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        closeNav();
      }
    });

    /* Close drawer when any non-trigger anchor is clicked */
    mainNav.querySelectorAll('a:not(.dropdown-trigger)').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    /* Close drawer on outside click */
    document.addEventListener('click', function (e) {
      if (
        mainNav.classList.contains('nav-open') &&
        !mainNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeNav();
      }
    });

    /* Close drawer on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

  }

  /* ================================================================
     2. DROPDOWN — click-triggered on ALL screen sizes
     CSS :hover is NOT used. JS .dd-open class controls everything.
  ================================================================ */

  document.querySelectorAll('.dropdown-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var parentLi = trigger.closest('.has-dropdown');
      if (!parentLi) return;

      var isOpen = parentLi.classList.contains('dd-open');

      /* Close all other open dropdowns */
      document.querySelectorAll('.has-dropdown.dd-open').forEach(function (el) {
        if (el !== parentLi) {
          el.classList.remove('dd-open');
          var t = el.querySelector('.dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      /* Toggle this dropdown */
      parentLi.classList.toggle('dd-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* Close dropdown when clicking anywhere outside it */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.dd-open').forEach(function (el) {
        el.classList.remove('dd-open');
        var t = el.querySelector('.dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ================================================================
     3. ANIMATED STAT COUNTERS
  ================================================================ */

  function animateCounter(el) {
    var target  = parseFloat(el.getAttribute('data-target'));
    var decimal = el.getAttribute('data-decimal') === 'true';
    var STEPS   = 60;
    var DURATION= 1500; /* ms */
    var step    = 0;

    var timer = setInterval(function () {
      step++;
      var progress = step / STEPS;
      var value    = target * progress;

      el.textContent = step >= STEPS
        ? (decimal ? target.toFixed(1) : String(Math.floor(target)))
        : (decimal ? value.toFixed(1)  : String(Math.floor(value)));

      if (step >= STEPS) clearInterval(timer);
    }, DURATION / STEPS);
  }

  /* ================================================================
     4. INTERSECTION OBSERVER — counters + scroll reveal
  ================================================================ */

  if ('IntersectionObserver' in window) {

    /* Counter observer */
    var counterObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
      counterObs.observe(el);
    });

    /* Scroll-reveal observer */
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });

    document.querySelectorAll(
      '.stat-card, .why-card, .bento-card, .service-item, .contact-card'
    ).forEach(function (el) {
      el.classList.add('reveal');
      revealObs.observe(el);
    });

  } else {
    /* Fallback for old browsers — show everything immediately */
    document.querySelectorAll('.stat-card, .why-card, .bento-card, .service-item, .contact-card').forEach(function (el) {
      el.classList.add('reveal', 'visible');
    });
  }

  /* ================================================================
     5. WHATSAPP FAB — show after scrolling 400px
  ================================================================ */

  if (fab) {
    window.addEventListener('scroll', function () {
      fab.classList.toggle('fab-visible', window.scrollY > 400);
    }, { passive: true });
  }

})();