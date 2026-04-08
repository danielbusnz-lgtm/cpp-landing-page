/**
 * CPP Kitchen & Bath - Cape Cod HOME Feature Landing Page
 * JavaScript for animations, slider, and tracking
 * Reference: plan.md > Scroll Animation Approach, GA4 Event Tracking
 */

(function() {
  'use strict';

  /* ==========================================================================
     SCROLL ANIMATIONS
     Using Intersection Observer API for performance
     Reference: plan.md > Scroll Animation Approach
     Docs: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
     ========================================================================== */

  /**
   * Initialize scroll-triggered animations
   * Elements with .fade-in, .fade-in-left, .fade-in-right, .stagger-children
   * will animate when they enter the viewport
   */
  function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Make all elements visible immediately
      document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-children').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    // Observer options
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -50px 0px', // trigger slightly before element is fully visible
      threshold: 0.1 // 10% of element visible
    };

    // Create observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation (performance optimization)
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.fade-in, .fade-in-left, .fade-in-right, .stagger-children'
    );

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     BEFORE/AFTER COMPARISON SLIDER
     Custom implementation with touch support
     Reference: plan.md > Before/After Slider Implementation
     ========================================================================== */

  /**
   * Initialize the before/after comparison slider
   */
  function initComparisonSlider() {
    const comparison = document.querySelector('.comparison');
    if (!comparison) return;

    const wrapper = comparison.querySelector('.comparison__wrapper');
    const afterImage = comparison.querySelector('.comparison__image--after');
    const slider = comparison.querySelector('.comparison__slider');
    const handle = comparison.querySelector('.comparison__handle');

    let isDragging = false;

    /**
     * Update slider position and image clip
     * @param {number} percentage - Position as percentage (0-100)
     */
    function updateSliderPosition(percentage) {
      // Clamp between 0 and 100
      percentage = Math.max(0, Math.min(100, percentage));

      // Update slider position
      slider.style.left = `${percentage}%`;

      // Update after image clip path
      afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;

      // Update ARIA value
      handle.setAttribute('aria-valuenow', Math.round(percentage));
    }

    /**
     * Get percentage from mouse/touch position
     * @param {number} clientX - X position of pointer
     * @returns {number} Percentage position
     */
    function getPercentageFromPosition(clientX) {
      const rect = wrapper.getBoundingClientRect();
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    // Mouse events
    function onMouseDown(e) {
      isDragging = true;
      comparison.style.cursor = 'ew-resize';
      updateSliderPosition(getPercentageFromPosition(e.clientX));
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      updateSliderPosition(getPercentageFromPosition(e.clientX));
    }

    function onMouseUp() {
      isDragging = false;
      comparison.style.cursor = 'ew-resize';
    }

    // Touch events
    function onTouchStart(e) {
      isDragging = true;
      updateSliderPosition(getPercentageFromPosition(e.touches[0].clientX));
    }

    function onTouchMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      updateSliderPosition(getPercentageFromPosition(e.touches[0].clientX));
    }

    function onTouchEnd() {
      isDragging = false;
    }

    // Keyboard support for accessibility
    function onKeyDown(e) {
      const currentValue = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
      let newValue = currentValue;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = currentValue - 5;
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = currentValue + 5;
          e.preventDefault();
          break;
        case 'Home':
          newValue = 0;
          e.preventDefault();
          break;
        case 'End':
          newValue = 100;
          e.preventDefault();
          break;
      }

      if (newValue !== currentValue) {
        updateSliderPosition(newValue);
      }
    }

    // Attach event listeners
    comparison.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    comparison.addEventListener('touchstart', onTouchStart, { passive: true });
    comparison.addEventListener('touchmove', onTouchMove, { passive: false });
    comparison.addEventListener('touchend', onTouchEnd);

    handle.addEventListener('keydown', onKeyDown);

    // Set initial position
    updateSliderPosition(50);
  }

  /* ==========================================================================
     SCRATCH CARD
     ========================================================================== */

  function initScratchCard() {
    const card = document.getElementById('scratchCard');
    const canvas = document.getElementById('scratchCanvas');
    if (!card || !canvas) return;

    const ctx = canvas.getContext('2d');
    let isScratching = false;
    let scratchedPercent = 0;

    // Set canvas size
    function setCanvasSize() {
      canvas.width = card.offsetWidth;
      canvas.height = card.offsetHeight;
      fillCanvas();
    }

    // Fill with scratch-off coating
    function fillCanvas() {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Scratch at position
    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fill();
      card.classList.add('scratched');
      checkScratchProgress();
    }

    // Check how much is scratched
    function checkScratchProgress() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
      }
      scratchedPercent = (transparent / (pixels.length / 4)) * 100;
      if (scratchedPercent > 50) {
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.5s';
      }
    }

    // Get position from event
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    // Event handlers - hover to scratch (no click needed)
    function doScratch(e) {
      e.preventDefault();
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    }

    // Init
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Mouse - just hover to scratch
    canvas.addEventListener('mousemove', doScratch);

    // Touch events
    canvas.addEventListener('touchstart', doScratch, { passive: false });
    canvas.addEventListener('touchmove', doScratch, { passive: false });
  }

  /* ==========================================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================================================== */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /* ==========================================================================
     ANALYTICS & TRACKING
     Reference: plan.md > GA4 Event Tracking
     ========================================================================== */

  /**
   * Track event with GA4
   * @param {string} eventName - Event name
   * @param {object} params - Event parameters
   */
  function trackEvent(eventName, params = {}) {
    // GA4 tracking
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }

    // Meta Pixel tracking
    if (typeof fbq === 'function') {
      // Map our events to Facebook events
      const fbEventMap = {
        'cta_click': 'Lead',
        'form_submit': 'Lead',
        'click_to_call': 'Contact',
        'outbound_link': 'ViewContent'
      };

      const fbEvent = fbEventMap[eventName];
      if (fbEvent) {
        fbq('track', fbEvent, params);
      }
    }

    // Console log for development
    console.log('Track:', eventName, params);
  }

  /**
   * Initialize click tracking for CTAs and links
   */
  function initClickTracking() {
    document.querySelectorAll('[data-track]').forEach(element => {
      element.addEventListener('click', function() {
        const eventName = this.getAttribute('data-track');
        const label = this.getAttribute('data-track-label') || this.textContent.trim();

        trackEvent(eventName, {
          button_text: label,
          button_location: this.closest('section')?.id || 'unknown'
        });
      });
    });
  }

  /**
   * Track scroll depth
   * Reference: plan.md > GA4 Event Tracking > scroll event
   */
  function initScrollDepthTracking() {
    const thresholds = [25, 50, 75, 90];
    const tracked = new Set();

    function checkScrollDepth() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackEvent('scroll', {
            percent_scrolled: threshold
          });
        }
      });
    }

    // Throttle scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScrollDepth();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ==========================================================================
     FORM HANDLING (for future contact form)
     ========================================================================== */

  function initFormTracking() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      let hasStarted = false;

      // Track form start
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', function() {
          if (!hasStarted) {
            hasStarted = true;
            trackEvent('form_start', {
              form_name: form.getAttribute('name') || 'contact_form'
            });
          }
        }, { once: true });
      });

      // Track form submit
      form.addEventListener('submit', function(e) {
        trackEvent('form_submit', {
          form_name: form.getAttribute('name') || 'contact_form'
        });
      });
    });
  }

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
      onDOMReady();
    }
  }

  function onDOMReady() {
    initScrollAnimations();
    initComparisonSlider();
    initScratchCard();
    initSmoothScroll();
    initClickTracking();
    initScrollDepthTracking();
    initFormTracking();

    // Log page view for development
    console.log('CPP Landing Page initialized');
  }

  // Start
  init();

})();
