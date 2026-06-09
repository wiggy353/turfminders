/**
 * Turf Minders — Main JavaScript
 * ================================
 * Handles:
 *   1. Mobile navigation toggle
 *   2. Sticky header scroll behavior
 *   3. Smooth scroll for anchor links
 *   4. Scroll-triggered animations (Intersection Observer)
 *   5. Back-to-top button
 *   6. Contact form validation & submission
 *   7. Footer copyright year auto-update
 *
 * No external libraries required.
 *
 * ================================================================
 * FORM SUBMISSION — IMPORTANT TODO:
 * ================================================================
 * The form currently logs to the console (dev mode) and shows a
 * success message. To make it actually send emails, choose one:
 *
 * OPTION A — Netlify Forms (easiest if hosting on Netlify):
 *   1. Add netlify attribute to <form>: <form netlify ...>
 *   2. Add a hidden field: <input type="hidden" name="form-name" value="quote-request" />
 *   3. Remove or comment out the fetch() call below — Netlify handles it.
 *
 * OPTION B — Formspree (free tier available, any host):
 *   1. Sign up at formspree.io and create a form.
 *   2. Set FORM_ENDPOINT below to your Formspree endpoint, e.g.:
 *      const FORM_ENDPOINT = 'https://formspree.io/f/yourformid';
 *   3. The fetch() call below is already structured for Formspree.
 *
 * OPTION C — EmailJS (client-side email, no backend):
 *   1. Sign up at emailjs.com and get Service ID, Template ID, Public Key.
 *   2. Include their SDK in index.html.
 *   3. Replace the fetch() call with emailjs.send(...).
 *
 * OPTION D — Your own backend endpoint:
 *   1. Set FORM_ENDPOINT to your API URL.
 *   2. The fetch() call below sends JSON — adjust as needed.
 * ================================================================
 */

'use strict';

/* ================================================================
   CONFIGURATION — update these values
   ================================================================ */

// TODO: Set your form submission endpoint (see options above)
const FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/yourformid'

// TODO: Update this email for mailto fallback
const CONTACT_EMAIL = 'info@turfminders.com'; // ✅ confirmed


/* ================================================================
   1. MOBILE NAVIGATION TOGGLE
   ================================================================ */
(function initNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  const header    = document.getElementById('site-header');

  if (!hamburger || !navLinks) return;

  function toggleMenu(open) {
    const isOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navLinks.classList.toggle('is-open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  // Toggle on hamburger click
  hamburger.addEventListener('click', () => toggleMenu());

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close menu on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  // Close menu if clicked outside nav on mobile
  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('is-open') &&
      !header.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });
})();


/* ================================================================
   2. STICKY HEADER SCROLL BEHAVIOR
   ================================================================
   Adds `.is-scrolled` class to the header when the user scrolls
   down, which triggers the compact header style in CSS.
   ================================================================ */
(function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 80; // px

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ================================================================
   3. SMOOTH SCROLL FOR ANCHOR LINKS
   ================================================================
   Handles offset for the sticky header height so section headings
   aren't hidden behind the nav bar.
   ================================================================ */
(function initSmoothScroll() {
  const NAV_OFFSET = 80; // px — should match --nav-height in CSS

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ================================================================
   4. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
   ================================================================
   Elements with class `.animate-on-scroll` fade in when they
   enter the viewport. CSS handles the actual animation.
   ================================================================ */
(function initScrollAnimations() {
  // Add animate-on-scroll to section children that should animate in
  const ANIMATED_SELECTORS = [
    '.service-card',
    '.why-card',
    '.pricing-card',
    '.gallery-pair',
    '.section-header',
  ];

  ANIMATED_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('animate-on-scroll');
    });
  });

  // Observe with Intersection Observer
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12, // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
})();


/* ================================================================
   5. BACK-TO-TOP BUTTON
   ================================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const SHOW_THRESHOLD = 400; // px

  window.addEventListener('scroll', () => {
    btn.hidden = window.scrollY < SHOW_THRESHOLD;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ================================================================
   6. CONTACT FORM — VALIDATION & SUBMISSION
   ================================================================ */
(function initContactForm() {
  const form        = document.getElementById('contact-form');
  const submitBtn   = document.getElementById('submit-btn');
  const successMsg  = document.getElementById('form-success');
  const errorMsg    = document.getElementById('form-error-msg');

  if (!form) return;

  /* ---- Validation helpers ---- */

  function getField(id) {
    return form.querySelector(`#${id}`);
  }

  function showError(fieldId, message) {
    const field = getField(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(fieldId) {
    const field = getField(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
  }

  function validateEmail(email) {
    // Basic RFC-compliant email format check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // Accept common US phone formats: digits, spaces, dashes, parens, dots
    // Must have at least 10 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  function validateForm(data) {
    let isValid = true;

    // Clear previous errors
    ['name', 'phone', 'email'].forEach(clearError);

    if (!data.name || data.name.trim().length < 2) {
      showError('name', 'Please enter your full name.');
      isValid = false;
    }

    if (!data.phone || !validatePhone(data.phone)) {
      showError('phone', 'Please enter a valid phone number.');
      isValid = false;
    }

    if (!data.email || !validateEmail(data.email)) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    }

    return isValid;
  }

  /* ---- Live validation (validate on blur for UX) ---- */

  getField('name')?.addEventListener('blur', () => {
    const val = getField('name').value;
    if (val && val.trim().length < 2) {
      showError('name', 'Please enter your full name.');
    } else if (val) {
      clearError('name');
    }
  });

  getField('phone')?.addEventListener('blur', () => {
    const val = getField('phone').value;
    if (val && !validatePhone(val)) {
      showError('phone', 'Please enter a valid phone number.');
    } else if (val) {
      clearError('phone');
    }
  });

  getField('email')?.addEventListener('blur', () => {
    const val = getField('email').value;
    if (val && !validateEmail(val)) {
      showError('email', 'Please enter a valid email address.');
    } else if (val) {
      clearError('email');
    }
  });

  /* ---- Honeypot check ---- */
  function isSpam(data) {
    // If the hidden honeypot field has a value, it's likely a bot
    return data.website && data.website.trim().length > 0;
  }

  /* ---- Form submission ---- */

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Spam check (honeypot)
    if (isSpam(data)) {
      // Silently succeed to fool bots
      form.reset();
      successMsg.hidden = false;
      return;
    }

    // Client-side validation
    if (!validateForm(data)) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      firstInvalid?.focus();
      return;
    }

    // UI: loading state
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    successMsg.hidden = true;
    errorMsg.hidden = true;

    try {
      if (FORM_ENDPOINT) {
        /* -------------------------------------------------------
           REAL SUBMISSION via fetch()
           Configured for Formspree / similar JSON-accepting APIs.
           For Netlify Forms, remove this block and use the netlify
           attribute on the <form> element instead.
           ------------------------------------------------------- */
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name:    data.name,
            phone:   data.phone,
            email:   data.email,
            address: data.address || '',
            service: data.service || '',
            message: data.message || '',
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        handleSuccess();

      } else {
        /* -------------------------------------------------------
           DEV FALLBACK — no endpoint configured
           Logs the data and simulates success after a short delay.
           In production, set FORM_ENDPOINT above.
           ------------------------------------------------------- */
        console.group('📬 Turf Minders — Form Submission (dev mode)');
        console.log('Name:    ', data.name);
        console.log('Phone:   ', data.phone);
        console.log('Email:   ', data.email);
        console.log('Address: ', data.address || '(not provided)');
        console.log('Service: ', data.service || '(not selected)');
        console.log('Message: ', data.message || '(not provided)');
        console.groupEnd();

        // Simulate network delay for testing
        await new Promise(resolve => setTimeout(resolve, 800));
        handleSuccess();
      }

    } catch (err) {
      console.error('Form submission error:', err);
      handleError();
    }
  });

  function handleSuccess() {
    form.reset();
    submitBtn.classList.remove('btn--loading');
    submitBtn.disabled = false;
    successMsg.hidden = false;
    errorMsg.hidden = true;
    // Scroll success message into view
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function handleError() {
    submitBtn.classList.remove('btn--loading');
    submitBtn.disabled = false;
    errorMsg.hidden = false;
    successMsg.hidden = true;
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

})();


/* ================================================================
   7. FOOTER COPYRIGHT YEAR — auto-updates every year
   ================================================================ */
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ================================================================
   UTILITY — Active nav link highlighting on scroll
   ================================================================
   Highlights the nav link corresponding to the currently visible
   section as the user scrolls.
   ================================================================ */
(function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const NAV_OFFSET = 100;

  function getActiveSection() {
    let active = null;
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= NAV_OFFSET) {
        active = section;
      }
    });
    return active;
  }

  function updateActiveLink() {
    const active = getActiveSection();
    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      const isActive = active && href === active.id;
      link.classList.toggle('nav-link--active', isActive);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();
