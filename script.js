/**
 * MÃ‰RE HAUS - Advanced Luxury Interaction & Motion Protocol
 * - Lenis Inertia Smooth Scroll
 * - Custom Minimalist UI Cursor with Lerp
 * - Line-Masked Staggered Text Reveals
 * - Image Sweep Zoom-Out Reveals & Parallax Effect
 * - Magnetic Hover CTA Buttons
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 6. INERTIA SMOOTH SCROLLING (Lenis)
  // ==========================================
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          lenis.scrollTo(targetId, { offset: -40 });
        }
      });
    });
  }

  // ==========================================
  // STEP 1: PRE-LOADER / LOADING OVERLAY LOGIC
  // ==========================================
  const startTime = Date.now();
  const MINIMUM_LOAD_TIME = 1500;

  function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MINIMUM_LOAD_TIME - elapsedTime);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 850);
    }, remainingTime);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 4000);
  }

  // ==========================================
  // 4. CUSTOM MINIMALIST UI CURSOR ENGINE
  // ==========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX, dotY = mouseY;
  let ringX = mouseX, ringY = mouseY;

  if (cursorDot && cursorRing && window.innerWidth >= 992) {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;

      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    const hoverables = document.querySelectorAll('a, button, input, select, .gallery-item, .service-card, .service-name, .service-price, .service-book-link, .service-tab-btn, [data-open-modal]');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('hovered');
      });
    });
  }

  // ==========================================
  // 3. MAGNETIC CTA BUTTONS
  // ==========================================
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - btnCenterX;
      const distanceY = e.clientY - btnCenterY;

      btn.style.transform = `translate(${distanceX * 0.32}px, ${distanceY * 0.32}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // ==========================================
  // PARALLAX SCROLL EFFECT FOR EXPERIENCE IMAGE
  // ==========================================
  const parallaxImgs = document.querySelectorAll('.parallax-img');

  function updateParallax() {
    parallaxImgs.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const translateY = (scrollProgress - 0.5) * -45; // Subtle 45px parallax movement
        img.style.transform = `translateY(${translateY}px) scale(1.05)`;
      }
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // ==========================================
  // STICKY HEADER TRANSITION
  // ==========================================
  const siteHeader = document.querySelector('.site-header');

  function updateHeaderState() {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  // Full-Screen Luxury Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');

  mobileToggle?.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
  });

  // Close menu when clicking a link inside it
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
    });
  });

  // ==========================================
  // 1 & 2. LINE-MASK & IMAGE ZOOM REVEALS (IntersectionObserver)
  // ==========================================
  const maskedElements = document.querySelectorAll('.line-mask, .img-zoom-reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    maskedElements.forEach(el => revealObserver.observe(el));
  } else {
    maskedElements.forEach(el => el.classList.add('revealed'));
  }

  setTimeout(() => {
    maskedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  }, 100);

  // ==========================================
  // PRAISE / TESTIMONIALS â€” Staggered Reveal
  // ==========================================
  const testimonialsGrid = document.querySelector('.testimonials-grid');
  const testimonialItems = document.querySelectorAll('.testimonial-item');
  const COL_STAGGER   = 0.15;  // seconds between each column's start
  const ATTR_DELAY    = 0.4;   // seconds after quote starts before attribution fades in

  function revealTestimonials() {
    testimonialItems.forEach(item => {
      const col = parseInt(item.getAttribute('data-col') || '0', 10);
      const colDelay = col * COL_STAGGER;

      // Column slides up â€” delayed by column index
      item.style.transitionDelay = `${colDelay}s`;

      // Quote slides up inside the mask â€” same delay, quote transition handles duration
      const quote = item.querySelector('.testimonial-quote');
      if (quote) {
        quote.style.transitionDelay = `${colDelay}s`;
      }

      // Attribution fades in 0.4s after this column's quote begins
      const attribution = item.querySelector('.testimonial-attribution');
      if (attribution) {
        attribution.style.transitionDelay = `${colDelay + ATTR_DELAY}s`;
      }

      // Trigger on next frame to ensure delays are applied first
      requestAnimationFrame(() => {
        item.classList.add('t-revealed');
      });
    });
  }

  if (testimonialsGrid && 'IntersectionObserver' in window) {
    const praiseObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target); // fire once only
          revealTestimonials();
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.15
    });
    praiseObserver.observe(testimonialsGrid);
  } else if (testimonialsGrid) {
    // Fallback: no IntersectionObserver â€” reveal immediately
    revealTestimonials();
  }

  // ==========================================
  // SERVICES TAB SYSTEM
  // ==========================================
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCategories = document.querySelectorAll('.service-category');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      serviceCategories.forEach(c => {
        // Close all open accordions in every category on tab switch
        c.querySelectorAll('.service-item.active').forEach(item => {
          item.classList.remove('active');
          const toggle = item.querySelector('.service-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
        c.classList.remove('active');
      });

      btn.classList.add('active');
      const activeCategory = document.getElementById(targetCategory);
      if (activeCategory) {
        activeCategory.classList.add('active');
      }
    });
  });

  // ==========================================
  // SERVICES â€” Accordion Click Handler
  // ==========================================
  function closeAllInCategory(category) {
    category.querySelectorAll('.service-item.active').forEach(item => {
      item.classList.remove('active');
      const toggle = item.querySelector('.service-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  const serviceToggles = document.querySelectorAll('.service-toggle');

  serviceToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      // Stop the click reaching the booking modal link inside (in case the link sits under the toggle)
      e.stopPropagation();

      const item = toggle.closest('.service-item');
      const category = toggle.closest('.service-category');
      const isAlreadyOpen = item.classList.contains('active');

      // Close all items in this category
      closeAllInCategory(category);

      // If it was closed, open it
      if (!isAlreadyOpen) {
        item.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================
  // SERVICES STAGGER REVEAL (Scroll-triggered)
  // ==========================================
  const STAGGER_DELAY = 0.08; // seconds per item â€” premium cascade

  function revealServiceCards(items) {
    items.forEach((item, i) => {
      item.style.transitionDelay = `${i * STAGGER_DELAY}s`;
      requestAnimationFrame(() => {
        item.classList.add('sr-revealed');
      });
    });
  }

  const servicesMenuLayout = document.querySelector('.services-menu-layout');
  let servicesSectionRevealed = false;

  if (servicesMenuLayout && 'IntersectionObserver' in window) {
    const servicesRevealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !servicesSectionRevealed) {
          servicesSectionRevealed = true;
          observer.unobserve(entry.target);
          const activeCategory = document.querySelector('.service-category.active');
          if (activeCategory) {
            revealServiceCards([...activeCategory.querySelectorAll('.service-item')]);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    });

    servicesRevealObserver.observe(servicesMenuLayout);
  } else if (servicesMenuLayout) {
    document.querySelectorAll('.service-item').forEach(item => item.classList.add('sr-revealed'));
  }

  // Tab switch: stagger-reveal items of newly active category
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-tab');
      const newCategory = document.getElementById(targetCategory);
      if (newCategory && servicesSectionRevealed) {
        const newItems = [...newCategory.querySelectorAll('.service-item')];
        newItems.forEach(item => {
          item.classList.remove('sr-revealed');
          item.style.transitionDelay = '0s';
        });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            revealServiceCards(newItems);
          });
        });
      }
    });
  });





  // ==========================================
  // BOOKING MODAL INTERACTION
  // ==========================================
  const modalOverlay = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtn = document.querySelector('.modal-close');
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const serviceSelect = document.getElementById('modalService');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const predefinedService = btn.getAttribute('data-service');
      if (predefinedService && serviceSelect) {
        serviceSelect.value = predefinedService;
      }
      modalOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (bookingForm) bookingForm.style.display = 'block';
      if (bookingSuccess) bookingSuccess.classList.remove('active');
    }, 400);
  }

  closeModalBtn?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = '<span>Processing...</span>';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      bookingForm.style.display = 'none';
      if (bookingSuccess) bookingSuccess.classList.add('active');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Confirm Reservation Request</span>';
        submitBtn.disabled = false;
      }
    }, 1200);
  });

  const dateInput = document.getElementById('modalDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // ==========================================
  // INTERACTIVE MESSY DECK FLIP ANIMATION ENGINE (10 CARDS)
  // ==========================================
  const messyDeckTrigger = document.getElementById('messyDeckTrigger');
  const lookbookModal = document.getElementById('lookbookModal');
  const lookbookCloseBtn = document.getElementById('lookbookCloseBtn');
  const lookbookModalScroll = document.getElementById('lookbookModalScroll');

  const cardRotations = [-5, 4, -3, 6, -6, 3, -4, 5, -2, 4];
  let isFlipAnimating = false;

  function openLookbookModal(targetIndex = 0) {
    if (!lookbookModal || isFlipAnimating) return;
    isFlipAnimating = true;

    const stackCards = document.querySelectorAll('.messy-deck-container .deck-card');
    const modalImages = lookbookModalScroll?.querySelectorAll('img') || [];

    // 1. FIRST: Record initial bounding boxes of clean cards in the stack
    const firstRects = Array.from(stackCards).map(card => card.getBoundingClientRect());

    // Lock body scroll and display modal container
    document.body.style.overflow = 'hidden';
    lookbookModal.classList.add('active');

    // Align scroll container to target image
    if (lookbookModalScroll && modalImages[targetIndex]) {
      const targetImg = modalImages[targetIndex];
      const scrollOffset = targetImg.offsetLeft - (window.innerWidth - targetImg.offsetWidth) / 2;
      lookbookModalScroll.scrollLeft = Math.max(0, scrollOffset);
    }

    // 2. LAST & INVERT & PLAY: Calculate deltas and FLIP animate from stack to horizontal track
    requestAnimationFrame(() => {
      const lastRects = Array.from(modalImages).map(img => img.getBoundingClientRect());

      modalImages.forEach((img, i) => {
        const first = firstRects[i] || firstRects[0];
        const last = lastRects[i];

        if (!first || !last) return;

        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        const deltaW = first.width / last.width;
        const deltaH = first.height / last.height;
        const rot = cardRotations[i] || 0;

        // Apply Invert state (no transition)
        img.style.transition = 'none';
        img.style.transformOrigin = 'top left';
        img.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH}) rotate(${rot}deg)`;
        img.style.opacity = '0.9';

        // Force browser repaint
        img.getBoundingClientRect();

        // Play FLIP animation with 0.04s rapid stagger delay per card and cubic-bezier(0.16, 1, 0.3, 1) easing
        const delay = i * 0.04;
        img.style.transition = `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity 0.4s ease ${delay}s`;
        img.style.transform = 'translate(0px, 0px) scale(1, 1) rotate(0deg)';
        img.style.opacity = '1';
      });

      // Reset inline transform styles once animation finishes
      setTimeout(() => {
        modalImages.forEach(img => {
          img.style.transition = '';
          img.style.transform = '';
          img.style.transformOrigin = '';
          img.style.opacity = '';
        });
        isFlipAnimating = false;
      }, 850);
    });
  }

  function closeLookbookModal() {
    if (!lookbookModal || isFlipAnimating) return;
    isFlipAnimating = true;

    const stackCards = document.querySelectorAll('.messy-deck-container .deck-card');
    const modalImages = lookbookModalScroll?.querySelectorAll('img') || [];

    // 1. FIRST: Get current scroll position bounding boxes of expanded track images
    const firstRects = Array.from(modalImages).map(img => img.getBoundingClientRect());

    // 2. LAST: Get target bounding boxes in messy deck stack
    const lastRects = Array.from(stackCards).map(card => card.getBoundingClientRect());

    // 3. REVERSE FLIP: Fly back photos from current scroll track position to deck coordinates
    modalImages.forEach((img, i) => {
      const first = firstRects[i];
      const last = lastRects[i] || lastRects[0];

      if (!first || !last) return;

      const deltaX = last.left - first.left;
      const deltaY = last.top - first.top;
      const deltaW = last.width / first.width;
      const deltaH = last.height / first.height;
      const rot = cardRotations[i] || 0;

      const delay = (modalImages.length - 1 - i) * 0.035;
      img.style.transition = `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity 0.5s ease ${delay + 0.08}s`;
      img.style.transformOrigin = 'top left';
      img.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH}) rotate(${rot}deg)`;
      img.style.opacity = '0.85';
    });

    // 4. Fade out background overlay and unlock body overflow ONLY after photos return to deck
    setTimeout(() => {
      lookbookModal.classList.remove('active');
      if (!modalOverlay?.classList.contains('active')) {
        document.body.style.overflow = '';
      }

      modalImages.forEach(img => {
        img.style.transition = '';
        img.style.transform = '';
        img.style.transformOrigin = '';
        img.style.opacity = '';
      });
      isFlipAnimating = false;
    }, 750);
  }

  messyDeckTrigger?.addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.deck-card');
    const index = clickedCard ? parseInt(clickedCard.getAttribute('data-index') || '0', 10) : 0;
    openLookbookModal(index);
  });

  lookbookCloseBtn?.addEventListener('click', closeLookbookModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lookbookModal?.classList.contains('active')) {
      closeLookbookModal();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    const overlayLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
        });
    }

    // Close menu when a link is clicked
    overlayLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-open');
        });
    });
});

// ==========================================
// INTERACTIVE TEAM BIO TOGGLES
// ==========================================
document.querySelectorAll('.team-bio-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const bioWrapper = document.getElementById(targetId);
        const isOpen = bioWrapper.classList.contains('is-open');

        bioWrapper.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', !isOpen);
        btn.textContent = isOpen ? 'Know More +' : 'Show Less -';
    });
});

// ==========================================

// ==========================================
// FOUNDER PROFILES MODAL LOGIC
// ==========================================
window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Close modal when clicking outside content
document.querySelectorAll('.mere-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Hamburger menu logic
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('luxuryHamburger');
    const closeBtn = document.getElementById('luxuryCloseBtn');
    const mobileMenu = document.getElementById('luxuryMobileMenu');
    
    if (hamburger && mobileMenu) {
        const menuLinks = mobileMenu.querySelectorAll('a');

        // Open the menu when hamburger is clicked
        hamburger.addEventListener('click', () => {
          mobileMenu.classList.add('is-open');
        });

        // Close the menu when the X is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              mobileMenu.classList.remove('is-open');
            });
        }

        // Close the menu when a link is clicked
        menuLinks.forEach(link => {
          link.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
          });
        });
    }
});
