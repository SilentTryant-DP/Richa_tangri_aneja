/* ============================================
   RICHA ANEJA — FULLY FUNCTIONAL SCRIPT
   ============================================ */

/* ---- SPLASH SCREEN ---- */
window.addEventListener('load', () => {
  // Try to play audio on first interaction
  const audio = document.getElementById('splash-audio');
  if (audio) {
    audio.currentTime = 25;
    const tryPlay = () => {
      audio.play().catch(() => {});
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
    document.addEventListener('click', tryPlay);
    document.addEventListener('touchstart', tryPlay);
  }

  // Hide splash after 2.4s
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('splash-hidden');
      setTimeout(() => { splash.style.display = 'none'; }, 900);
    }
  }, 2400);

  initCarousel();
  initMobileMenu();
  initNavbarScroll();
  initReveal();
  initForms();
});

/* ---- NAVBAR: scroll effect ---- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ---- MOBILE MENU ---- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar-container')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---- HERO CAROUSEL ---- */
let slideIndex = 0;
let slideTimer = null;

function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  showSlide(0);
  slideTimer = setInterval(() => advanceSlide(1), 3500);
}

function showSlide(n) {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  if (!slides.length) return;

  slideIndex = (n + slides.length) % slides.length;

  slides.forEach((s, i) => {
    s.classList.toggle('fade', i === slideIndex);
  });
  indicators.forEach((ind, i) => {
    ind.classList.toggle('active', i === slideIndex);
  });
}

function advanceSlide(dir) {
  const slides = document.querySelectorAll('.carousel-slide');
  showSlide((slideIndex + dir + slides.length) % slides.length);
}

function changeSlide(dir) {
  clearInterval(slideTimer);
  advanceSlide(dir);
  slideTimer = setInterval(() => advanceSlide(1), 3500);
}

function currentSlide(n) {
  clearInterval(slideTimer);
  showSlide(n - 1);
  slideTimer = setInterval(() => advanceSlide(1), 3500);
}

// Keyboard arrow navigation for carousel
document.addEventListener('keydown', e => {
  if (document.querySelector('.modal.active') || document.querySelector('.lightbox.active') || document.querySelector('.legal-modal.active')) return;
  if (e.key === 'ArrowLeft') changeSlide(-1);
  if (e.key === 'ArrowRight') changeSlide(1);
});

/* ---- INNER-PAGE CAROUSEL (performances/awards) ---- */
function initInnerCarousel(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const slides = container.querySelectorAll('.perf-slide');
  const dots = container.querySelectorAll('.perf-dot');
  let idx = 0;

  function show(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  show(0);

  // Expose controls
  container._show = show;
  container._next = () => show(idx + 1);
  container._prev = () => show(idx - 1);
}

/* ---- SCROLL REVEAL ---- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => io.observe(item));
}

/* ---- MODAL HELPERS ---- */
function _openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Focus first input
  setTimeout(() => {
    const first = m.querySelector('input, textarea, button.close');
    if (first) first.focus();
  }, 100);
}

function _closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('active');
  document.body.style.overflow = '';
}

// Click outside to close
window.addEventListener('click', e => {
  ['contactModal', 'bookingModal', 'legalModal'].forEach(id => {
    const m = document.getElementById(id);
    if (m && e.target === m) _closeModal(id);
  });
  const lb = document.getElementById('lightbox');
  if (lb && e.target === lb) closeLightbox();
});

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['contactModal', 'bookingModal', 'legalModal'].forEach(id => _closeModal(id));
    closeLightbox();
  }
});

/* CONTACT MODAL */
function openContact() { _openModal('contactModal'); }
function closeContact() { _closeModal('contactModal'); }

/* BOOKING MODAL */
function openBooking() { _openModal('bookingModal'); }
function closeBooking() { _closeModal('bookingModal'); }

/* ---- FORM VALIDATION & SUBMISSION ---- */
function initForms() {
  setupForm('contactForm', 'contactSuccess', closeContact);
  setupForm('bookingForm', 'bookingSuccess', closeBooking);
}

function setupForm(formId, successId, closeFn) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.classList.add('btn-loading');
    btn.disabled = true;

    // Simulate sending (replace with real EmailJS or fetch if desired)
    await new Promise(r => setTimeout(r, 1200));

    btn.classList.remove('btn-loading');
    btn.disabled = false;

    form.style.display = 'none';
    const success = document.getElementById(successId);
    if (success) success.style.display = 'block';

    showToast('✓ Your message has been sent!');
    form.reset();

    setTimeout(() => {
      if (success) success.style.display = 'none';
      form.style.display = '';
      closeFn();
    }, 3500);
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    const isEmpty = !field.value.trim();
    const isEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);

    if (isEmpty || isEmail) {
      valid = false;
      field.classList.add('field-error');
      if (group) group.classList.add('has-error');
    } else {
      field.classList.remove('field-error');
      if (group) group.classList.remove('has-error');
    }
  });
  return valid;
}

// Clear errors on input
document.addEventListener('input', e => {
  if (e.target.classList.contains('field-error')) {
    e.target.classList.remove('field-error');
    const group = e.target.closest('.form-group');
    if (group) group.classList.remove('has-error');
  }
});

/* ---- TOAST ---- */
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (type ? ' toast-' + type : '');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

/* ---- LIGHTBOX (gallery) ---- */
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(srcs, idx) {
  lightboxImages = Array.isArray(srcs) ? srcs : [srcs];
  lightboxIndex = idx || 0;
  renderLightbox();
  const lb = document.getElementById('lightbox');
  if (lb) { lb.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function renderLightbox() {
  const img = document.getElementById('lightboxImg');
  if (img) img.src = lightboxImages[lightboxIndex];
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  renderLightbox();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) { lb.classList.remove('active'); document.body.style.overflow = ''; }
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});

/* ---- LEGAL MODAL ---- */
const LEGAL_CONTENT = {
  privacy: `
    <h2>Privacy Policy</h2>
    <p><strong>Last updated:</strong> April 2026</p>
    <h3>Information We Collect</h3>
    <p>When you use the contact or booking forms on this website, we collect your name, email address, and any details you provide. This information is used solely to respond to your inquiry or process your booking request.</p>
    <h3>How We Use Your Information</h3>
    <p>We use your contact information exclusively to communicate with you regarding your inquiry. We do not sell, share, or distribute your personal information to third parties.</p>
    <h3>Cookies</h3>
    <p>This website uses no tracking cookies. We may use essential session data to ensure the website functions correctly.</p>
    <h3>Contact Us</h3>
    <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:kapil955@gmail.com" style="color: var(--maroon);">kapil955@gmail.com</a>.</p>
  `,
  terms: `
    <h2>Terms of Service</h2>
    <p><strong>Last updated:</strong> April 2026</p>
    <h3>Use of this Website</h3>
    <p>This website is for informational and booking purposes for Richa Aneja's musical services. By accessing this site, you agree to use it only for lawful purposes and in a manner that does not infringe the rights of others.</p>
    <h3>Intellectual Property</h3>
    <p>All images, audio, video, and text content on this website are the property of Richa Aneja and may not be reproduced, distributed, or used without prior written permission.</p>
    <h3>Booking Requests</h3>
    <p>Submitting a booking form does not constitute a confirmed booking. Confirmation will be provided via email after availability is verified. Payment terms and performance agreements will be provided upon confirmation.</p>
    <h3>Limitation of Liability</h3>
    <p>Richa Aneja and her team are not liable for any direct or indirect damages arising from use of this website or reliance on any information contained herein.</p>
    <h3>Contact</h3>
    <p>For any questions regarding these Terms, contact us at <a href="mailto:kapil955@gmail.com" style="color: var(--maroon);">kapil955@gmail.com</a>.</p>
  `
};

function openLegal(type) {
  const inner = document.getElementById('legalInner');
  if (inner) inner.innerHTML = LEGAL_CONTENT[type] || '';
  _openModal('legalModal');
}

function closeLegal() { _closeModal('legalModal'); }

/* ---- INNER PAGE CAROUSEL HELPER (used by performances & awards) ---- */
let perfSlideIdx = 1;

function perfChangeSlide(n) {
  perfShowSlide(perfSlideIdx += n);
}

function perfCurrentSlide(n) {
  perfShowSlide(perfSlideIdx = n);
}

function perfShowSlide(n) {
  const slides = document.querySelectorAll('.perf-slide');
  const dots = document.querySelectorAll('.perf-dot');
  if (!slides.length) return;

  if (n > slides.length) perfSlideIdx = 1;
  if (n < 1) perfSlideIdx = slides.length;

  slides.forEach((s, i) => s.classList.toggle('active', i === perfSlideIdx - 1));
  dots.forEach((d, i) => d.classList.toggle('active', i === perfSlideIdx - 1));
}

/* ---- GALLERY INIT (called from inner pages) ---- */
function initGallery(selector) {
  const items = document.querySelectorAll(selector);
  const srcs = Array.from(items).map(item => {
    const img = item.querySelector('img');
    return item.dataset.full || (img ? img.src : '');
  });

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(srcs, i));
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(srcs, i);
      }
    });
  });
}

/* ---- LIGHTBOX HTML (injected if needed) ---- */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('lightbox')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
        <button class="lightbox-close" onclick="closeLightbox()" aria-label="Close">×</button>
        <button class="lightbox-prev" onclick="lightboxNav(-1)" aria-label="Previous">&#10094;</button>
        <img id="lightboxImg" src="" alt="Gallery image">
        <button class="lightbox-next" onclick="lightboxNav(1)" aria-label="Next">&#10095;</button>
      </div>
    `);
  }

  // Init reveals for any page
  initReveal();

  // Init inner page carousel if present
  if (document.querySelector('.perf-slide')) {
    perfShowSlide(1);
    setInterval(() => perfChangeSlide(1), 4000);
  }

  // Init gallery lightbox
  if (document.querySelector('.gallery-item')) {
    initGallery('.gallery-item');
  }
});

console.log('Richa Aneja — site loaded ✨');
