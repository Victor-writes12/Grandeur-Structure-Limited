// ===============================
// GRANDEUR STRUCTURES — MAIN JS
//===================
// === EMAILJS LOADER ===
// Loads the EmailJS SDK once and exposes a small helper the contact form uses below.
(function () {
  const SDK_SRC = 'https://cdn.emailjs.com/dist/email.min.js';

  let sdkReady = new Promise((resolve, reject) => {
    if (window.emailjs && window.emailjs.send) return resolve(window.emailjs);

    const s = document.createElement('script');
    s.src = SDK_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      if (window.emailjs && window.emailjs.send) {
        resolve(window.emailjs);
      } else {
        reject(new Error('EmailJS SDK loaded but `emailjs` not found'));
      }
    };
    s.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(s);
  });

  window.emailHelper = {
    ready: sdkReady,
    init(publicKey) {
      return sdkReady.then((emailjs) => {
        try { emailjs.init(publicKey); } catch (e) { /* ignore */ }
        return emailjs;
      });
    },
    sendForm(serviceId, templateId, formEl, publicKey) {
      return sdkReady.then((emailjs) => {
        if (publicKey) {
          try { emailjs.init(publicKey); } catch (e) { /* ignore */ }
        }
        if (!emailjs || !emailjs.sendForm) {
          return Promise.reject(new Error('EmailJS SDK not available'));
        }
        return emailjs.sendForm(serviceId, templateId, formEl, publicKey);
      });
    }
  };

  if (window.EMAILJS_PUBLIC_KEY && window.EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    window.emailHelper.init(window.EMAILJS_PUBLIC_KEY).catch(() => {});
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  // === PRELOADER ===
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.querySelector('.hero-content').classList.add('in');
    }, 900); // preloader shows briefly, max ~2s including transition
  });
  // Fallback in case 'load' fires very late (slow images) — never block more than 2s
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.querySelector('.hero-content').classList.add('in');
  }, 2000);

  // === NAVBAR SCROLL EFFECT ===
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

    // === MOBILE MENU ===
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('mobileMenuScrim');
  const closeBtn = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    if (scrim) scrim.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (scrim) scrim.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
    document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
    if (scrim) scrim.addEventListener('click', closeMobileMenu);
  }

  // === SCROLL REVEAL (IntersectionObserver) ===
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblingsInView = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const idx = siblingsInView.indexOf(el);
        el.style.transitionDelay = `${Math.min(idx, 6) * 0.08}s`;
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // === ANIMATED COUNTERS ===
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = el.dataset.count;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    // If the "count" isn't a plain number (e.g. MBA badge), just render it directly.
    const numeric = parseFloat(target);
    if (isNaN(numeric)) {
      el.textContent = prefix;
      return;
    }
    let current = 0;
    const duration = 1400;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = numeric / steps;
    const isBadge = !!el.dataset.prefix;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numeric) {
        current = numeric;
        clearInterval(timer);
      }
      el.textContent = (isBadge ? prefix + ' ' : '') + Math.floor(current) + suffix;
    }, stepTime);
  }

  // === BUTTON RIPPLE EFFECT ===
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // === PORTFOLIO FILTER ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      masonryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hide', !match);
      });
    });
  });

  // === LIGHTBOX ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGroup = [];
  let currentIndex = 0;

  function openLightbox(groupImgs, index) {
    currentGroup = groupImgs;
    currentIndex = index;
    updateLightboxImg();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxImg() {
    const imgEl = currentGroup[currentIndex];
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Project gallery triggers ("View Case Study" buttons + clicking gallery images)
  document.querySelectorAll('.gallery-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.gallery;
      const imgs = Array.from(document.querySelectorAll(`[data-gallery-group="${group}"] .gallery-img`));
      openLightbox(imgs, 0);
    });
  });
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
      const group = img.closest('[data-gallery-group]');
      const imgs = Array.from(group.querySelectorAll('.gallery-img'));
      const idx = imgs.indexOf(img);
      openLightbox(imgs, idx);
    });
  });

  // Portfolio masonry images also open a simple single-image lightbox
  document.querySelectorAll('.masonry-item img').forEach(img => {
    img.addEventListener('click', () => {
      const allMasonryImgs = Array.from(document.querySelectorAll('.masonry-item:not(.hide) img'));
      const idx = allMasonryImgs.indexOf(img);
      openLightbox(allMasonryImgs, idx);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    updateLightboxImg();
  });
  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentGroup.length;
    updateLightboxImg();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });
  // === CONTACT FORM ===
  const EMAILJS_SERVICE_ID = 'service_87abpgf';
  const EMAILJS_TEMPLATE_ID = 'template_tol0e18';
  const EMAILJS_PUBLIC_KEY = 'lzMsVv6e9ocGTTpv0';

  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;

    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
      // EmailJS not yet configured — friendly fallback so the form still feels responsive.
      formNote.textContent = 'Thanks for reaching out! Email sending isn\u2019t connected yet \u2014 please contact us directly at granduerstructures@gmail.com or WhatsApp +234 805 432 6246 in the meantime.';
      contactForm.reset();
      return;
    }

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    window.emailHelper.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm, EMAILJS_PUBLIC_KEY)
      .then(() => {
        formNote.textContent = 'Thank you, your message has been sent. We will be in touch shortly.';
        contactForm.reset();
      })
      .catch(() => {
        formNote.textContent = 'Something went wrong. Please email us directly at granduerstructures@gmail.com.';
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });

   // === FOOTER YEAR ===
  document.querySelectorAll('#year').forEach(el => { el.textContent = new Date().getFullYear(); });

  // === PAGE TRANSITION FOR INTERNAL ANCHOR LINKS (subtle fade, native smooth-scroll handles motion) ===
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // === COOKIE CONSENT BANNER ===
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner) {
    const CONSENT_KEY = 'gs_cookie_consent';
    const accept = document.getElementById('cookieAccept');
    const decline = document.getElementById('cookieDecline');

    const hasConsent = () => {
      try { return !!localStorage.getItem(CONSENT_KEY); }
      catch (e) { return true; } // if storage is blocked, don't keep nagging
    };
    const setConsent = (value) => {
      try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* ignore */ }
    };

    if (!hasConsent()) {
      setTimeout(() => cookieBanner.classList.add('show'), 1200);
    }
    if (accept) {
      accept.addEventListener('click', () => {
        setConsent('accepted');
        cookieBanner.classList.remove('show');
      });
    }
    if (decline) {
      decline.addEventListener('click', () => {
        setConsent('declined');
        cookieBanner.classList.remove('show');
      });
    }
  }

});

  // === BACK TO TOP ===
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }