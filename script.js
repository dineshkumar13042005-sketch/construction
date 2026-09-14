// Responsive Media Query Watcher (Modern replacement for window.innerWidth)
const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

const handleViewportChange = (e) => {
  if (e.matches) {
    console.log('Phone view');
  } else {
    console.log('Desktop view');
  }
};

mobileMediaQuery.addEventListener('change', handleViewportChange);
handleViewportChange(mobileMediaQuery);

// Enhanced Accessible Mobile Navigation Toggle
const menuButton = document.querySelector('.menu-toggle') || document.querySelector('.menu');
const navigation = document.querySelector('.main-nav') || document.querySelector('.navbar');

if (menuButton && navigation) {
  const toggleMenu = (shouldOpen) => {
    const isCurrentlyActive = navigation.classList.contains('active') || navigation.classList.contains('open');
    const newState = typeof shouldOpen === 'boolean' ? shouldOpen : !isCurrentlyActive;

    navigation.classList.toggle('active', newState);
    navigation.classList.toggle('open', newState);
    menuButton.classList.toggle('active', newState);
    menuButton.setAttribute('aria-expanded', newState ? 'true' : 'false');
  };

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when user clicks outside navigation container
  document.addEventListener('click', (e) => {
    if (!navigation.contains(e.target) && !menuButton.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMenu(false);
    }
  });
}

// Before & After Image Slider Component
const compare = document.querySelector('#compare');
if (compare) {
  let dragging = false;
  const moveCompare = (event) => {
    if (!dragging && event.type !== 'click') return;
    const bounds = compare.getBoundingClientRect();
    const position = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
    compare.querySelector('.after-image').style.width = `${position}%`;
    compare.querySelector('.compare-handle').style.left = `${position}%`;
  };
  compare.addEventListener('pointerdown', event => {
    dragging = true;
    compare.setPointerCapture(event.pointerId);
    moveCompare(event);
  });
  compare.addEventListener('pointermove', moveCompare);
  compare.addEventListener('pointerup', () => { dragging = false; });
  compare.addEventListener('click', moveCompare);
}

// Scroll Reveal Observer (Entry Animations for Pictures, Cards, Text, and Sections)
const initScrollReveals = () => {
  const selectors = [
    '.section h2',
    '.section > p',
    '.about-image',
    '.about-copy',
    '.service-card-item',
    '.service-detail-section',
    '.project-grid article',
    '.process-card',
    '.review-card',
    '.value-card',
    '.approach-card',
    '.feature-icon-card',
    '.gallery-preview-item',
    '.contact-preview-grid',
    '.stats > div',
    '.timeline-item',
    '.contact-strip',
    '.compact-service-tag',
    '.zigzag-project-row',
    '.video-showcase-section'
  ];

  const elementsToAnimate = document.querySelectorAll(selectors.join(', '));

  elementsToAnimate.forEach((el) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(el => observer.observe(el));
};

// Interactive Fullscreen Image Lightbox Modal with Next/Prev Slide Controls
const initLightboxModal = () => {
  // Ensure Lightbox DOM exists or setup active lightbox modal
  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">✕</button>
      <button class="lightbox-arrow lightbox-prev" aria-label="Previous image">‹</button>
      <button class="lightbox-arrow lightbox-next" aria-label="Next image">›</button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="Full view image">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalImg = modal.querySelector('.lightbox-img') || modal.querySelector('#lightbox-img');
  const modalCaption = modal.querySelector('.lightbox-caption') || modal.querySelector('#lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close') || modal.querySelector('#lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-prev') || modal.querySelector('#lightbox-prev');
  const nextBtn = modal.querySelector('.lightbox-next') || modal.querySelector('#lightbox-next');

  let imageList = [];
  let currentIndex = 0;

  const updateLightboxImage = () => {
    if (imageList.length === 0) return;
    const currentItem = imageList[currentIndex];
    if (modalImg) {
      modalImg.src = currentItem.src;
      modalImg.alt = currentItem.alt || '';
      modalImg.classList.remove('zoomed');
    }
    if (modalCaption) {
      modalCaption.textContent = '';
    }
  };

  if (modalImg) {
    modalImg.addEventListener('click', (e) => {
      e.stopPropagation();
      modalImg.classList.toggle('zoomed');
    });
  }

  const openLightbox = (images, index) => {
    imageList = images;
    currentIndex = index;
    updateLightboxImage();
    modal.classList.add('open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  const showNext = () => {
    if (imageList.length === 0) return;
    currentIndex = (currentIndex + 1) % imageList.length;
    updateLightboxImage();
  };

  const showPrev = () => {
    if (imageList.length === 0) return;
    currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    updateLightboxImage();
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrev();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-close') || e.target.id === 'lightbox-close') {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open') && modal.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Attach click handler to ALL project, service, gallery, and showcase content images across all pages
  const selectorList = [
    'main img',
    'section img',
    'article img',
    '.service-detail-image img',
    '.portfolio-card-image img',
    '.gallery-card-item img',
    '.bento-item img',
    '.gallery-slide-item img',
    '.expertise-card img',
    '.ba-card img',
    '.about-image img',
    '.project-grid img',
    '.gallery-preview-grid img'
  ];

  const allImages = Array.from(document.querySelectorAll(selectorList.join(', ')))
    .filter(img => !img.closest('.brand') && img.src && !img.src.endsWith('.svg') && img.offsetParent !== null);

  allImages.forEach((img) => {
    img.style.cursor = 'pointer';
    img.setAttribute('title', 'Click to view full image');
    img.addEventListener('click', (e) => {
      e.preventDefault();
      const imagesData = allImages.map(i => ({
        src: i.src,
        alt: i.alt || i.getAttribute('title') || 'Siva Construction Project Image'
      }));
      const idx = allImages.indexOf(img);
      openLightbox(imagesData, idx >= 0 ? idx : 0);
    });
  });
};

// Animated Number Counter Effect for Reviews Page & Stats (Counts 1 to 5 on touch/view)
const initCounterAnimation = () => {
  const counters = document.querySelectorAll('.count-up');
  if (counters.length === 0) return;

  const animateCounter = (el) => {
    const start = parseFloat(el.getAttribute('data-start') || '1');
    const target = parseFloat(el.getAttribute('data-target') || '5');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1400; // 1.4 seconds smooth ease
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const currentValue = start + (target - start) * easeProgress;

      el.textContent = currentValue.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    };

    requestAnimationFrame(updateValue);
  };

  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(c => observer.observe(c));

  // Re-trigger counter from 1 to 5 when user touches, clicks, or hovers on review cards/links
  const reviewElements = document.querySelectorAll('.google-trust-badge-card, a[href*="Reviews.html"], .review-card-item, .stats > div');
  reviewElements.forEach(item => {
    const runAnim = () => {
      counters.forEach(c => animateCounter(c));
    };
    item.addEventListener('click', runAnim);
    item.addEventListener('touchstart', runAnim, { passive: true });
    item.addEventListener('mouseenter', runAnim);
  });
};

// Hero Background Image Slider (Rotates siva 34.png, siva 35.png, and siva 36.png)
const initHeroSlider = () => {
  const heroImage = document.querySelector('.hero-image');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');

  if (!heroImage || (!prevBtn && !nextBtn)) return;

  const slides = [
    'siva 35.png',
    'siva 36.png',
    'siva 34.png'
  ];
  let currentIndex = 0;

  const changeSlide = (newIndex) => {
    currentIndex = (newIndex + slides.length) % slides.length;
    heroImage.style.opacity = '0.4';
    setTimeout(() => {
      heroImage.style.backgroundImage = `url('${encodeURI(slides[currentIndex])}')`;
      heroImage.style.opacity = '1';
    }, 150);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => changeSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => changeSlide(currentIndex + 1));
  }
};

// Dedicated 3D Image Showcase Tilt for Home Page Hero
const initHero3DImage = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  const heroContent = document.querySelector('.hero-content');
  if (!hero || !heroImage) return;

  let rAF;

  const handleMouseMove = (e) => {
    if (rAF) cancelAnimationFrame(rAF);

    rAF = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const pctX = ((x / rect.width) * 100).toFixed(1);
      const pctY = ((y / rect.height) * 100).toFixed(1);

      const rotX = (((rect.height / 2 - y) / (rect.height / 2)) * 12).toFixed(2);
      const rotY = (((x - rect.width / 2) / (rect.width / 2)) * 12).toFixed(2);

      heroImage.style.transform = `scale3d(1.05, 1.05, 1.05) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      heroImage.style.setProperty('--hero-glare-x', `${pctX}%`);
      heroImage.style.setProperty('--hero-glare-y', `${pctY}%`);

      if (heroContent) {
        heroContent.style.transform = `translateY(-45%) perspective(1000px) rotateX(${(-rotX * 0.4).toFixed(2)}deg) rotateY(${(-rotY * 0.4).toFixed(2)}deg) translateZ(50px)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rAF) cancelAnimationFrame(rAF);
    heroImage.style.transition = 'transform 0.6s ease-out';
    heroImage.style.transform = 'scale3d(1.02, 1.02, 1.02) rotateX(0deg) rotateY(0deg)';
    if (heroContent) {
      heroContent.style.transition = 'transform 0.6s ease-out';
      heroContent.style.transform = 'translateY(-45%) translateZ(40px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const handleMouseEnter = () => {
    heroImage.style.transition = 'transform 0.1s ease-out';
    if (heroContent) heroContent.style.transition = 'transform 0.1s ease-out';
  };

  hero.addEventListener('mousemove', handleMouseMove, { passive: true });
  hero.addEventListener('mouseleave', handleMouseLeave);
  hero.addEventListener('mouseenter', handleMouseEnter);
};

// Scroll-Driven Autoplay & Interactive Controls for Portrait Videos
const initScrollPlayVideos = () => {
  const videoWrappers = document.querySelectorAll('.portrait-video-wrapper, .index-video-wrapper');
  const allVideos = document.querySelectorAll('video');

  if (videoWrappers.length === 0 && allVideos.length === 0) return;

  const wrappersToObserve = videoWrappers.length > 0 ? Array.from(videoWrappers) : Array.from(allVideos).map(v => v.parentElement);

  wrappersToObserve.forEach(wrapper => {
    if (!wrapper) return;
    const video = wrapper.querySelector('video') || (wrapper.tagName === 'VIDEO' ? wrapper : null);
    if (!video) return;

    // Ensure default attributes for reliable scroll autoplay
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const soundBtn = wrapper.querySelector('.video-sound-toggle');
    const playBtn = wrapper.querySelector('.video-play-center-btn');
    const progressBar = wrapper.querySelector('.video-progress-bar');

    // Mute/Unmute sound button handler
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        soundBtn.textContent = video.muted ? '🔇' : '🔊';
        soundBtn.setAttribute('title', video.muted ? 'Click to Unmute' : 'Click to Mute');
      });
    }

    // Play/Pause status visual state helper
    const updatePlayState = (isPlaying) => {
      wrapper.classList.toggle('is-playing', isPlaying);
      wrapper.classList.toggle('paused', !isPlaying);
      if (playBtn) {
        playBtn.textContent = isPlaying ? '❚❚' : '▶';
      }
    };

    video.addEventListener('play', () => updatePlayState(true));
    video.addEventListener('pause', () => updatePlayState(false));

    // Progress bar handler
    if (progressBar) {
      video.addEventListener('timeupdate', () => {
        if (video.duration) {
          const pct = (video.currentTime / video.duration) * 100;
          progressBar.style.width = `${pct}%`;
        }
      });
    }

    // Click on video wrapper to toggle play / pause manually
    wrapper.addEventListener('click', (e) => {
      if (e.target.closest('.video-sound-toggle')) return;
      if (video.paused) {
        video.play().catch(err => console.log('Autoplay deferred:', err));
      } else {
        video.pause();
      }
    });
  });

  // IntersectionObserver: automatically plays video when scrolled down into view & pauses when scrolled out
  const observerOptions = {
    threshold: 0.35,
    rootMargin: '0px 0px -30px 0px'
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const wrapper = entry.target;
      const video = wrapper.querySelector('video') || (wrapper.tagName === 'VIDEO' ? wrapper : null);
      if (!video) return;

      if (entry.isIntersecting) {
        // Scrolled down into view -> Play automatically
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            wrapper.classList.add('is-playing');
            wrapper.classList.remove('paused');
          }).catch(err => {
            console.log('Scroll autoplay deferred by browser:', err);
          });
        }
      } else {
        // Scrolled out of view -> Pause automatically
        if (!video.paused) {
          video.pause();
          wrapper.classList.remove('is-playing');
          wrapper.classList.add('paused');
        }
      }
    });
  }, observerOptions);

  wrappersToObserve.forEach(w => videoObserver.observe(w));
};

// Interactive Category Filter System for Projects Page
const initProjectFilters = () => {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.portfolio-card-item, .execution-card-item');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.getAttribute('data-filter') || 'all';

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (selectedFilter === 'all' || cardCategory.includes(selectedFilter)) {
          card.classList.remove('is-hidden');
          card.style.display = 'flex';
        } else {
          card.classList.add('is-hidden');
          card.style.display = 'none';
        }
      });
    });
  });
};

const initApp = () => {
  initScrollReveals();
  initLightboxModal();
  initCounterAnimation();
  initHeroSlider();
  initHero3DImage();
  initScrollPlayVideos();
  initProjectFilters();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}





