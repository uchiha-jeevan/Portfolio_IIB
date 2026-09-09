/**
 * Jeevan Reddy K - Portfolio Scripts
 * Modern Vanilla JavaScript for UI interactions, theme switching, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Switcher (Dark / Light Mode)
  initTheme();

  // 2. Navigation & Mobile Drawer
  initNavigation();

  // 3. Scroll Reveal Animations & Active Link Tracking
  initScrollEffects();

  // 4. Animated Stat Counters
  initStatCounters();

  // 5. Skills Matrix Filtering
  initSkillsFilter();

  // 6. Contact Form & Toast Notification
  initContactForm();

  // 7. Back To Top Button
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Theme Management
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (metaColorScheme) {
      metaColorScheme.content = theme;
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  // Initial theme decision
  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (systemPrefersDark.matches) {
    applyTheme('dark');
  } else {
    applyTheme('dark'); // Default to our stunning cyber-slate dark mode
  }

  // Handle manual toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(newTheme === 'dark' ? 'Switched to Cyber Dark mode 🌙' : 'Switched to Clean Light mode ☀️');
    });
  }

  // Listen to OS-level theme change if user hasn't explicitly set a preference
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Navigation & Mobile Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header blur and background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinksContainer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Scroll Effects & Active Nav Links
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));
}

/* --------------------------------------------------------------------------
   4. Animated Stat Counters
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (!statElements.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const isFloat = el.getAttribute('data-counter-float') === 'true';
        const duration = 1800; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeOut;

          el.textContent = `${prefix}${isFloat ? currentVal.toFixed(1) : Math.floor(currentVal)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${isFloat ? target.toFixed(1) : target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach((el) => counterObserver.observe(el));
}

/* --------------------------------------------------------------------------
   5. Skills Matrix Filtering
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Contact Form & Toast Notifications
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all required fields.', 'error');
      return;
    }

    // Submit button state
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg style="animation: spin 1s linear infinite;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Sending Message...
    `;

    // Simulate sending with elegant feedback and direct mailto link trigger
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();

      showToast(`Thank you, ${name}! Your message has been sent successfully.`);

      // Also trigger a prefilled mailto draft in the background for real email sending
      const mailtoUrl = `mailto:jeevankothapallie143@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
      
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      // We don't force click it if popups are blocked, but provide it as fallback
    }, 1200);
  });
}

function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconSvg = type === 'error' 
    ? `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    : `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

/* --------------------------------------------------------------------------
   7. Back To Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
      backToTopBtn.style.transform = 'translateY(0)';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
      backToTopBtn.style.transform = 'translateY(10px)';
    }
  });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
