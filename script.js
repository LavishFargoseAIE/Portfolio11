/**
 * ═════════════════════════════════════════════════════════════════
 * LAVISH FARGOSE — PORTFOLIO
 * Theme: Cinematic Japanese Garden at Dusk
 * Interactive JavaScript Engine
 * ═════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── 1. Accessibility & Motion Preferences ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  // ═════════════════════════════════════════════════════════════════
  // 2. GATE OPENING INTRO CONTROLLER
  // ═════════════════════════════════════════════════════════════════
  const gateIntro = document.getElementById('gate-intro');
  const enterBtn = document.getElementById('enter-garden-btn');
  const skipBtn = document.getElementById('skip-intro-btn');
  const replayBtns = [
    document.getElementById('replay-intro-btn'),
    document.getElementById('footer-replay-btn'),
    document.getElementById('mobile-replay-btn')
  ].filter(Boolean);

  let isIntroOpen = false;

  function openGate(instant = false) {
    if (isIntroOpen) return;
    isIntroOpen = true;

    // Trigger bamboo cut animation on the enter button
    if (enterBtn) {
      triggerBambooCut(enterBtn);
    }

    if (instant || prefersReducedMotion.matches) {
      if (gateIntro) {
        gateIntro.classList.add('open');
        gateIntro.classList.add('hidden');
        gateIntro.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('intro-active');
      return;
    }

    // Animate sliding gates
    if (gateIntro) {
      gateIntro.classList.add('open');
      document.body.classList.remove('intro-active');

      setTimeout(() => {
        gateIntro.classList.add('hidden');
        gateIntro.setAttribute('aria-hidden', 'true');
      }, 950);
    }
  }

  function replayGate() {
    isIntroOpen = false;
    if (gateIntro) {
      gateIntro.classList.remove('hidden');
      gateIntro.setAttribute('aria-hidden', 'false');
      // Force repaint
      void gateIntro.offsetWidth;
      gateIntro.classList.remove('open');
      document.body.classList.add('intro-active');

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Focus the enter button for keyboard accessibility
      setTimeout(() => {
        if (enterBtn) enterBtn.focus();
      }, 300);
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', () => openGate(false));
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', () => openGate(true));
  }

  replayBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile drawer if open
      closeMobileDrawer();
      replayGate();
    });
  });

  // Automatically skip intro if user prefers reduced motion
  if (prefersReducedMotion.matches) {
    openGate(true);
  }


  // ═════════════════════════════════════════════════════════════════
  // 3. SAKURA PETALS CANVAS ENGINE
  // Gentle, floating cherry blossom petals drifting across dusk sky.
  // ═════════════════════════════════════════════════════════════════
  const canvas = document.getElementById('sakura-canvas');
  if (canvas && !prefersReducedMotion.matches) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let petals = [];

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initPetals();
    }

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = 8 + Math.random() * 8; // Size 8-16px
        this.speedY = 0.8 + Math.random() * 1.2;
        this.speedX = 0.4 + Math.random() * 0.8;
        this.angle = Math.random() * 360;
        this.angularSpeed = (Math.random() - 0.5) * 1.5;
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = 0.02 + Math.random() * 0.03;
        this.opacity = 0.45 + Math.random() * 0.45;
        this.swayAmplitude = 20 + Math.random() * 30;
        this.swayOffset = Math.random() * 100;
        // Natural petal hue variation: soft rose to sakura blush
        const hue = 345 + Math.floor(Math.random() * 15);
        this.color1 = `hsla(${hue}, 85%, 88%, ${this.opacity})`;
        this.color2 = `hsla(${hue}, 80%, 75%, ${this.opacity * 0.9})`;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin((this.y + this.swayOffset) * 0.015) * 0.6 + this.speedX;
        this.angle += this.angularSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 20 || this.x > width + 20) {
          this.reset(false);
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate((this.angle * Math.PI) / 180);
        context.scale(1, Math.sin(this.flip));

        // Draw organic sakura petal shape using bezier curves
        context.beginPath();
        context.moveTo(0, -this.size);
        context.bezierCurveTo(
          this.size * 0.7, -this.size * 0.7,
          this.size * 0.8, this.size * 0.4,
          0, this.size
        );
        context.bezierCurveTo(
          -this.size * 0.8, this.size * 0.4,
          -this.size * 0.7, -this.size * 0.7,
          0, -this.size
        );
        context.closePath();

        // Shaded blossom gradient
        const grad = context.createLinearGradient(0, -this.size, 0, this.size);
        grad.addColorStop(0, this.color1);
        grad.addColorStop(1, this.color2);
        context.fillStyle = grad;
        context.fill();

        context.restore();
      }
    }

    function initPetals() {
      // Modest count for performance: 22 on desktop, 10 on mobile
      const petalCount = window.innerWidth < 768 ? 10 : 22;
      petals = [];
      for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
      }
    }

    function renderPetals() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw(ctx);
      }
      animationFrameId = requestAnimationFrame(renderPetals);
    }

    // Start Petals
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    renderPetals();

    // Pause when tab is hidden to conserve battery & CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        renderPetals();
      }
    });
  }


  // ═════════════════════════════════════════════════════════════════
  // 4. BAMBOO BUTTON KATANA CUT INTERACTION
  // Tactile bamboo plate slash effect upon click or keyboard press.
  // ═════════════════════════════════════════════════════════════════
  function triggerBambooCut(buttonEl) {
    if (!buttonEl) return;
    buttonEl.classList.remove('is-slashed');
    void buttonEl.offsetWidth; // Trigger reflow
    buttonEl.classList.add('is-slashed');

    setTimeout(() => {
      buttonEl.classList.remove('is-slashed');
    }, 320);
  }

  const allBambooBtns = document.querySelectorAll('.bamboo-btn');
  allBambooBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      triggerBambooCut(this);
    });

    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        triggerBambooCut(this);
      }
    });
  });


  // ═════════════════════════════════════════════════════════════════
  // 5. KATANA CURSOR & CLICK SLASH EFFECT (Fine Pointer Desktop)
  // Refined katana follower and clean silver-pink slash glints.
  // ═════════════════════════════════════════════════════════════════
  const follower = document.getElementById('katana-follower');
  const slashContainer = document.getElementById('katana-slash-container');

  if (isFinePointer.matches && !prefersReducedMotion.matches && follower && slashContainer) {
    document.body.classList.add('has-pointer');

    window.addEventListener('mousemove', (e) => {
      follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });

    // Enlarge katana follower when hovering over interactive elements
    const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], .interactive';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('is-hovering-interactive');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('is-hovering-interactive');
      }
    });

    // Spawn elegant slash effect on click
    window.addEventListener('click', (e) => {
      // Avoid spawning over form inputs to keep editing completely clean
      if (e.target.matches('input, textarea')) return;

      const slash = document.createElement('div');
      slash.className = 'katana-click-slash';
      slash.style.left = `${e.clientX}px`;
      slash.style.top = `${e.clientY}px`;

      // Slight angle variation for organic martial feel (-40deg to -25deg)
      const randomAngle = -28 - (Math.random() * 16);
      slash.style.setProperty('--slash-angle', `${randomAngle}deg`);

      slashContainer.appendChild(slash);

      setTimeout(() => {
        slash.remove();
      }, 300);
    });
  }


  // ═════════════════════════════════════════════════════════════════
  // 6. FLOATING BAMBOO NAVIGATION & ACTIVE SECTION OBSERVER
  // ═════════════════════════════════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-bamboo-plate');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveNavLink(id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  function setActiveNavLink(activeId) {
    desktopNavLinks.forEach(link => {
      const targetSection = link.getAttribute('data-section');
      if (targetSection === activeId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    mobileNavLinks.forEach(link => {
      const targetSection = link.getAttribute('data-section');
      if (targetSection === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Smooth scroll handler for nav plates
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        closeMobileDrawer();
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });
        // Move focus for screen readers
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  function openMobileDrawer() {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileDrawer() {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileDrawer();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
        mobileToggle.focus();
      }
    });
  }


  // ═════════════════════════════════════════════════════════════════
  // 7. PORTRAIT SWITCHER (Artistic Placeholder ⇄ Real Photo)
  // ═════════════════════════════════════════════════════════════════
  const togglePortraitBtn = document.getElementById('toggle-portrait-view-btn');
  const realImg = document.getElementById('user-portrait-img');
  const placeholderDiv = document.getElementById('portrait-placeholder');

  if (togglePortraitBtn && realImg && placeholderDiv) {
    togglePortraitBtn.addEventListener('click', () => {
      const isShowingReal = realImg.style.display !== 'none';
      if (isShowingReal) {
        realImg.style.display = 'none';
        placeholderDiv.style.display = 'flex';
        togglePortraitBtn.querySelector('span').textContent = 'Switch to photo.jpeg';
      } else {
        realImg.style.display = 'block';
        placeholderDiv.style.display = 'none';
        togglePortraitBtn.querySelector('span').textContent = 'Switch to Placeholder';
      }
    });
  }


  // ═════════════════════════════════════════════════════════════════
  // 8. BACK TO TOP BUTTON
  // ═════════════════════════════════════════════════════════════════
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });
  }


  // ═════════════════════════════════════════════════════════════════
  // 9. CONTACT FORM INTERACTION & ACCESSIBILITY
  // Courteous client-side validation and feedback along garden path.
  // ═════════════════════════════════════════════════════════════════
  const contactForm = document.getElementById('garden-contact-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');
  const statusMsg = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Reset errors
      document.getElementById('name-error').textContent = '';
      document.getElementById('email-error').textContent = '';
      document.getElementById('message-error').textContent = '';
      if (statusMsg) statusMsg.textContent = '';

      if (!nameVal) {
        document.getElementById('name-error').textContent = 'Please enter your name.';
        isValid = false;
      }

      if (!emailVal) {
        document.getElementById('email-error').textContent = 'Please enter your email.';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!messageVal) {
        document.getElementById('message-error').textContent = 'Please write a brief message.';
        isValid = false;
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('.form-submit-btn');
        if (submitBtn) triggerBambooCut(submitBtn);

        if (statusMsg) {
          statusMsg.className = 'form-status-msg success';
          statusMsg.textContent = '❀ Your message has been sent along the garden path. Thank you!';
        }
        contactForm.reset();
      }
    });
  }

});
