// ========================================
// PERFORMANCE UTILS
// ========================================
const isMobile = () => window.innerWidth <= 900 || ('ontouchstart' in window);

function throttle(fn, limit) {
  let last = 0;
  return function (...args) {
    const now = performance.now();
    if (now - last >= limit) { last = now; fn.apply(this, args); }
  };
}

function rafThrottle(fn) {
  let pending = false;
  return function (...args) {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { fn.apply(this, args); pending = false; });
  };
}

// ========================================
// PAGE LOADER + TEXT SCRAMBLE
// ========================================
window.addEventListener("load", () => {
  const loader         = document.querySelector(".page-loader");
  const hero           = document.querySelector(".hero");
  const scrambleTarget = document.querySelector(".loader-text h1");

  hero.style.opacity   = "0";
  hero.style.transform = "translateY(30px)";
  hero.style.filter    = "blur(6px)";
  document.body.classList.add("loading");

  const scramble = (el, finalText, duration = 1400) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";
    const total = Math.round(duration / 30);
    let frame = 0;
    const step = () => {
      el.textContent = finalText.split("").map((char, i) => {
        if (char === " ") return " ";
        if (frame / total > i / finalText.length) return char;
        return chars[(Math.random() * chars.length) | 0];
      }).join("");
      frame++;
      if (frame < total) requestAnimationFrame(step);
      else el.textContent = finalText;
    };
    requestAnimationFrame(step);
  };

  setTimeout(() => {
    if (scrambleTarget) scramble(scrambleTarget, "RISMA FANI", 1400);
  }, 400);

  setTimeout(() => {
    loader.style.transition = "opacity 1.2s cubic-bezier(.22,1,.36,1)";
    loader.style.opacity    = "0";
    hero.style.transition   = "all 1.4s cubic-bezier(.22,1,.36,1)";
    hero.style.opacity      = "1";
    hero.style.transform    = "translateY(0)";
    hero.style.filter       = "blur(0px)";
    setTimeout(() => {
      loader.remove();
      document.body.classList.remove("loading");
    }, 1200);
  }, 2400);
});

// ========================================
// TYPING
// ========================================
const text = ["Web Developer", "UI UX Designer", "Creative Coder", "Frontend Enthusiast"];
let count = 0, index = 0;

(function type() {
  if (count === text.length) count = 0;
  const currentText = text[count];
  const letter = currentText.slice(0, ++index);
  document.getElementById("typing").textContent = letter;
  if (letter.length === currentText.length) {
    count++; index = 0;
    setTimeout(type, 1500);
  } else {
    setTimeout(type, 90);
  }
})();

// ========================================
// SCROLL REVEAL
// ========================================
const reveals = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-zoom"
);
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("active"), i * 120);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
reveals.forEach(el => revealObs.observe(el));

// ========================================
// UNIVERSAL SCROLL REVEAL
// ========================================
const revealTargets = [
  { selector: '.section-title', delay: 0,  class: 'reveal-up'    },
  { selector: '.about-stat',    delay: 80, class: 'reveal-up'    },
  { selector: '.tech-card',     delay: 50, class: 'reveal-up'    },
  { selector: '.soft-item',     delay: 60, class: 'reveal-up'    },
  { selector: '.journey-card',  delay: 80, class: 'reveal-up'    },
  { selector: '.contact-item',  delay: 60, class: 'reveal-up'    },
  { selector: '.contact-info',  delay: 0,  class: 'reveal-left'  },
  { selector: '.contact-box',   delay: 0,  class: 'reveal-right' },
  { selector: '.footer',        delay: 0,  class: 'reveal-up'    },
];

revealTargets.forEach(({ selector, delay, class: animClass }) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    const already = ['reveal','reveal-left','reveal-right','reveal-up','reveal-zoom']
      .some(c => el.classList.contains(c));
    if (!already) el.classList.add(animClass);
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('active'), i * delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  elements.forEach(el => obs.observe(el));
});

// ========================================
// STAGGER DOMINO
// ========================================
function initStagger(selector, cssClass) {
  const cards = document.querySelectorAll(selector);
  if (!cards.length) return;
  cards.forEach((card, i) => {
    card.classList.add(cssClass);
    card.style.setProperty('--i', i);
  });
  const parents = new Set([...cards].map(c => c.closest('section') || c.parentElement));
  parents.forEach(parent => {
    const parentCards = [...cards].filter(c =>
      (c.closest('section') || c.parentElement) === parent
    );
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          parentCards.forEach((card, idx) => card.style.setProperty('--i', idx));
          parentCards.forEach((card, idx) => {
            setTimeout(() => card.classList.add('active'), idx * 110);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });
    obs.observe(parent);
  });
}
initStagger('.portfolio-card', 'stagger-card');
initStagger('.gallery-item',   'stagger-card');

// ========================================
// NAVBAR SCROLL
// ========================================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", rafThrottle(() => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
}), { passive: true });

// ========================================
// HAMBURGER MENU
// ========================================
const menuToggle = document.querySelector(".menu-toggle");
const navLinks   = document.querySelector(".nav-links");
const navItems   = document.querySelectorAll(".nav-links a");

function closeMenu() {
  navLinks.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  navLinks.setAttribute("aria-hidden", window.innerWidth <= 900 ? "true" : "false");
  document.body.classList.remove("menu-open");
}
function openMenu() {
  navLinks.classList.add("active");
  menuToggle.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
  navLinks.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

closeMenu();
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  navLinks.classList.contains("active") ? closeMenu() : openMenu();
});
navItems.forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
  else if (!navLinks.classList.contains("active"))
    navLinks.setAttribute("aria-hidden", "true");
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
document.addEventListener("click", (e) => {
  if (navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)) closeMenu();
});

// ========================================
// THEME TOGGLE
// ========================================
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem("theme") === "light") document.body.classList.add("light");

// ========================================
// SCROLL PROGRESS BAR
// ========================================
const progress = document.querySelector(".scroll-progress");
window.addEventListener("scroll", rafThrottle(() => {
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  progress.style.width = (window.pageYOffset / totalHeight) * 100 + "%";
}), { passive: true });

// ========================================
// GALAXY NETWORK CANVAS
// ========================================
const galaxyCanvas = document.getElementById("galaxy-network");
const gtx = galaxyCanvas.getContext("2d");
let galaxyVisible = true;

document.addEventListener("visibilitychange", () => { galaxyVisible = !document.hidden; });

function resizeGalaxy() {
  galaxyCanvas.width  = window.innerWidth;
  galaxyCanvas.height = window.innerHeight;
}
resizeGalaxy();
window.addEventListener("resize", throttle(resizeGalaxy, 300));

const PARTICLE_COUNT = isMobile() ? 18 : 35;
const galaxyParticles = [];
for (let i = 0; i < PARTICLE_COUNT; i++) {
  galaxyParticles.push({
    x:    Math.random() * galaxyCanvas.width,
    y:    Math.random() * galaxyCanvas.height,
    vx:   (Math.random() - .5) * 0.35,
    vy:   (Math.random() - .5) * 0.35,
    size: Math.random() * 1.8 + 0.8
  });
}
const CONNECT_DIST = isMobile() ? 90 : 130;

function animateGalaxy() {
  if (!galaxyVisible) { requestAnimationFrame(animateGalaxy); return; }
  gtx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
  const len = galaxyParticles.length;
  for (let i = 0; i < len; i++) {
    const p = galaxyParticles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > galaxyCanvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > galaxyCanvas.height)  p.vy *= -1;
    gtx.beginPath();
    gtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    gtx.fillStyle = "rgba(180,120,255,.75)";
    gtx.fill();
  }
  const distSq = CONNECT_DIST * CONNECT_DIST;
  for (let a = 0; a < len - 1; a++) {
    for (let b = a + 1; b < len; b++) {
      const dx = galaxyParticles[a].x - galaxyParticles[b].x;
      const dy = galaxyParticles[a].y - galaxyParticles[b].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < distSq) {
        const alpha = (0.11 * (1 - d2 / distSq)).toFixed(3);
        gtx.beginPath();
        gtx.strokeStyle = `rgba(180,120,255,${alpha})`;
        gtx.lineWidth = 0.8;
        gtx.moveTo(galaxyParticles[a].x, galaxyParticles[a].y);
        gtx.lineTo(galaxyParticles[b].x, galaxyParticles[b].y);
        gtx.stroke();
      }
    }
  }
  requestAnimationFrame(animateGalaxy);
}
animateGalaxy();

// ========================================
// CUSTOM CURSOR + STARDUST (desktop only)
// ========================================
if (!isMobile()) {
  const cursor = document.querySelector(".custom-cursor");
  const ring   = document.querySelector(".cursor-ring");
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  const trailColors = ["#ff7ac6","#c4b5fd","#6ee7ff","#ffffff","#ffb3e6","#a78bfa"];
  const MAX_TRAIL   = 14;
  const trailPool   = [];
  for (let i = 0; i < MAX_TRAIL; i++) {
    const dot = document.createElement("div");
    dot.classList.add("stardust-dot");
    document.body.appendChild(dot);
    trailPool.push(dot);
  }
  let trailIndex = 0, lastTrailX = 0, lastTrailY = 0;
  window.addEventListener("mousemove", throttle((e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`;
    const dx = mouseX - lastTrailX, dy = mouseY - lastTrailY;
    if (dx * dx + dy * dy > 100) {
      lastTrailX = mouseX; lastTrailY = mouseY;
      const dot   = trailPool[trailIndex % MAX_TRAIL]; trailIndex++;
      const size  = 4 + Math.random() * 4;
      const color = trailColors[(Math.random() * trailColors.length) | 0];
      const ox    = (Math.random() - .5) * 10, oy = (Math.random() - .5) * 10;
      dot.style.cssText = `width:${size}px;height:${size}px;left:${mouseX+ox}px;top:${mouseY+oy}px;background:${color};box-shadow:0 0 ${size*2}px ${color};opacity:1;transform:translate(-50%,-50%) scale(1);`;
      dot.classList.add("stardust-active");
      setTimeout(() => {
        dot.style.opacity   = "0";
        dot.style.transform = "translate(-50%,-50%) scale(0)";
        setTimeout(() => dot.classList.remove("stardust-active"), 350);
      }, 60);
    }
  }, 16));
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll("a, button, .tech-card").forEach(item => {
    item.addEventListener("mouseenter", () => { cursor.classList.add("cursor-hover"); ring.classList.add("cursor-ring-hover"); });
    item.addEventListener("mouseleave", () => { cursor.classList.remove("cursor-hover"); ring.classList.remove("cursor-ring-hover"); });
  });
}

// ========================================
// MAGNETIC BUTTON (desktop only)
// ========================================
if (!isMobile()) {
  document.querySelectorAll(".btn.primary, .btn.secondary").forEach(btn => {
    btn.addEventListener("mousemove", throttle((e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.3;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-5px)`;
    }, 16));
    btn.addEventListener("mouseleave", () => {
      btn.style.transform  = "";
      btn.style.transition = "transform .5s cubic-bezier(.22,1,.36,1), box-shadow .4s ease";
    });
    btn.addEventListener("mouseenter", () => {
      btn.style.transition = "transform .1s ease, box-shadow .4s ease";
    });
  });
}

// ========================================
// PARALLAX (desktop only)
// ========================================
const heroAvatar = document.querySelector(".hero-avatar");
const orbit1El   = document.querySelector(".orbit1");
const orbit2El   = document.querySelector(".orbit2");
const orbit3El   = document.querySelector(".orbit3");

if (!isMobile()) {
  window.addEventListener("scroll", rafThrottle(() => {
    const sy = window.pageYOffset;
    if (heroAvatar) heroAvatar.style.transform = `translateY(${sy * 0.07}px)`;
    if (orbit1El)   orbit1El.style.transform   = `translateY(${sy * 0.04}px) rotate(${sy * 0.04}deg)`;
    if (orbit2El)   orbit2El.style.transform   = `translateY(${sy * 0.07}px) rotate(${-sy * 0.025}deg)`;
    if (orbit3El)   orbit3El.style.transform   = `translateY(${sy * 0.1}px) rotate(${sy * 0.015}deg)`;
  }), { passive: true });

  const heroSection = document.querySelector(".hero");
  heroSection?.addEventListener("mousemove", throttle((e) => {
    const rect = heroSection.getBoundingClientRect();
    const mx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const my = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    if (heroAvatar) heroAvatar.style.transform = `translateY(-16px) rotateY(${mx*7}deg) rotateX(${-my*5}deg)`;
    if (orbit1El)   orbit1El.style.transform   = `translate(${mx*5}px,${my*5}px)`;
    if (orbit2El)   orbit2El.style.transform   = `translate(${mx*10}px,${my*8}px)`;
    if (orbit3El)   orbit3El.style.transform   = `translate(${mx*15}px,${my*11}px)`;
  }, 20));
  heroSection?.addEventListener("mouseleave", () => {
    if (heroAvatar) heroAvatar.style.transform = "";
    if (orbit1El)   orbit1El.style.transform   = "";
    if (orbit2El)   orbit2El.style.transform   = "";
    if (orbit3El)   orbit3El.style.transform   = "";
  });
}

// ========================================
// SPARK ON HERO HOVER (desktop only)
// ========================================
if (!isMobile()) {
  const heroVisual  = document.querySelector(".hero-visual");
  const sparkColors = ["#ff7ac6","#8b5cf6","#6ee7ff","#fff","#ffb3e6","#c4b5fd"];
  heroVisual?.addEventListener("mousemove", throttle((e) => {
    for (let i = 0; i < 4; i++) {
      const spark = document.createElement("div");
      spark.classList.add("spark");
      const angle = Math.random() * 360, dist = 30 + Math.random() * 50;
      spark.style.left       = e.clientX + "px";
      spark.style.top        = e.clientY + "px";
      spark.style.background = sparkColors[(Math.random() * sparkColors.length) | 0];
      spark.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      spark.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      spark.style.width = spark.style.height = (3 + Math.random() * 5) + "px";
      spark.style.boxShadow = `0 0 5px ${spark.style.background}`;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  }, 60));
}

// ========================================
// TIMELINE DRAG + TOUCH SWIPE
// ========================================
const slider = document.querySelector(".timeline-scroll");
if (slider) {
  let isDragging = false, startX = 0, scrollLeft = 0;
  let velocity = 0, lastDragX = 0, momentumId;
  const stopMomentum = () => { cancelAnimationFrame(momentumId); velocity = 0; };

  slider.addEventListener("mousedown", (e) => {
    isDragging = true; slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
    lastDragX = e.pageX; stopMomentum();
  });
  slider.addEventListener("mouseleave", () => { isDragging = false; slider.classList.remove("dragging"); });
  slider.addEventListener("mouseup", () => {
    isDragging = false; slider.classList.remove("dragging");
    const startMomentum = () => {
      if (Math.abs(velocity) < 0.5) return;
      slider.scrollLeft -= velocity; velocity *= 0.92;
      momentumId = requestAnimationFrame(startMomentum);
    };
    startMomentum();
  });
  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    velocity = e.pageX - lastDragX; lastDragX = e.pageX;
    slider.scrollLeft = scrollLeft - (x - startX) * 1.6;
  });

  let touchStartX = 0, touchScrollLeft = 0, touchVelocity = 0, lastTouchX = 0;
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX; touchScrollLeft = slider.scrollLeft;
    lastTouchX = touchStartX; touchVelocity = 0; stopMomentum();
  }, { passive: true });
  slider.addEventListener("touchmove", (e) => {
    const tx = e.touches[0].clientX;
    touchVelocity = lastTouchX - tx; lastTouchX = tx;
    slider.scrollLeft = touchScrollLeft + (touchStartX - tx) * 1.1;
  }, { passive: true });
  slider.addEventListener("touchend", () => {
    const momentum = () => {
      if (Math.abs(touchVelocity) < 0.5) return;
      slider.scrollLeft += touchVelocity; touchVelocity *= 0.93;
      momentumId = requestAnimationFrame(momentum);
    };
    momentum();
  }, { passive: true });

  if (window.innerWidth <= 768) {
    setTimeout(() => {
      slider.scrollBy({ left: 55, behavior: "smooth" });
      setTimeout(() => slider.scrollBy({ left: -55, behavior: "smooth" }), 550);
    }, 700);
  }
}

// ========================================
// GALLERY LIGHTBOX
// ========================================
function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (!galleryItems.length) return;

  const lb = document.createElement("div");
  lb.className = "gallery-lightbox";
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close"><i class="fa-solid fa-xmark"></i></button>
      <button class="lb-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <button class="lb-next"><i class="fa-solid fa-chevron-right"></i></button>
      <div class="lb-img-wrap">
        <img class="lb-img" src="" alt="" loading="lazy" />
      </div>
      <div class="lb-caption"></div>
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector(".lb-img");
  const lbCaption = lb.querySelector(".lb-caption");
  let currentIndex = 0;
  const images = [...galleryItems].map(el => ({
    src:     el.dataset.src || el.querySelector("img")?.src,
    caption: el.dataset.caption || ""
  }));

  function openLightbox(i) {
    currentIndex = i;
    lbImg.style.opacity   = "0";
    lbImg.src             = images[i].src;
    lbCaption.textContent = images[i].caption;
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
    lbImg.onload = () => { lbImg.style.opacity = "1"; };
  }
  function closeLightbox() {
    lb.classList.remove("active");
    document.body.style.overflow = "";
  }
  function prevImg() { currentIndex = (currentIndex - 1 + images.length) % images.length; openLightbox(currentIndex); }
  function nextImg() { currentIndex = (currentIndex + 1) % images.length; openLightbox(currentIndex); }

  galleryItems.forEach((item, i) => item.addEventListener("click", () => openLightbox(i)));
  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", prevImg);
  lb.querySelector(".lb-next").addEventListener("click", nextImg);
  lb.querySelector(".lb-backdrop").addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  prevImg();
    if (e.key === "ArrowRight") nextImg();
  });

  let lbTouchStartX = 0;
  lb.addEventListener("touchstart", (e) => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend",   (e) => {
    const diff = lbTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) diff > 0 ? nextImg() : prevImg();
  });
}
initGallery();

// ========================================
// ACTIVE NAVBAR LINK
// ========================================
const sections    = document.querySelectorAll("section[id]");
const navLinkList = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", rafThrottle(() => {
  let current = "";
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 130) current = section.getAttribute("id");
  });
  navLinkList.forEach(link => {
    link.classList.toggle("active-link", link.getAttribute("href") === `#${current}`);
  });
}), { passive: true });

// ========================================
// COUNTER ANIMATION
// ========================================
function animateCounter(el, target, suffix, duration = 1600) {
  let start = null;
  const num = parseInt(target);
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * num) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll(".stat-num");
let countersTriggered = false;
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersTriggered) {
      countersTriggered = true;
      statNums.forEach((el, i) => {
        const raw    = el.textContent.trim();
        const num    = raw.replace(/\D/g, "");
        const suffix = raw.replace(/\d/g, "");
        el.textContent = "0" + suffix;
        setTimeout(() => animateCounter(el, num, suffix, 1400), i * 180);
      });
      counterObs.disconnect();
    }
  });
}, { threshold: 0.4 });
if (statNums.length) counterObs.observe(statNums[0].closest(".about-stats") || statNums[0]);

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    const old = this.querySelector(".ripple-wave");
    if (old) old.remove();
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement("span");
    ripple.className    = "ripple-wave";
    ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;border-radius:50%;background:rgba(255,255,255,0.25);transform:scale(0);animation:rippleAnim 0.6s cubic-bezier(.16,1,.3,1) forwards;pointer-events:none;z-index:0;`;
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

// ========================================
// CONTACT FORM — FORMSPREE
// ========================================
(function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.setAttribute("novalidate", "true");

  const nameInput  = form.querySelector("input[type='text']");
  const emailInput = form.querySelector("input[type='email']");
  const msgInput   = form.querySelector("textarea");
  const submitBtn  = form.querySelector("button[type='submit']");

  function showError(input, msg) {
    input.classList.add("input-error", "input-shake");
    setTimeout(() => input.classList.remove("input-shake"), 500);
    let err = input.parentElement.querySelector(".err-msg");
    if (!err) {
      err = document.createElement("span");
      err.className = "err-msg";
      input.parentElement.appendChild(err);
    }
    err.textContent   = msg;
    err.style.opacity = "1";
  }

  function clearError(input) {
    input.classList.remove("input-error");
    const err = input.parentElement.querySelector(".err-msg");
    if (err) err.style.opacity = "0";
  }

  [nameInput, emailInput, msgInput].forEach(inp => {
    if (inp) inp.addEventListener("input", () => clearError(inp));
  });

  function setBtnState(state, origText) {
    const states = {
      loading: { text: "⏳ Sending...",       bg: "",                                        disabled: true,  opacity: "0.8" },
      success: { text: "✓ Message Sent!",     bg: "linear-gradient(135deg,#10b981,#059669)", disabled: true,  opacity: "1"   },
      error:   { text: "✗ Failed, try again", bg: "linear-gradient(135deg,#ef4444,#dc2626)", disabled: false, opacity: "1"   },
      reset:   { text: origText,              bg: "",                                        disabled: false, opacity: "1"   },
    };
    const s = states[state];
    submitBtn.textContent      = s.text;
    submitBtn.style.background = s.bg;
    submitBtn.style.opacity    = s.opacity;
    submitBtn.disabled         = s.disabled;
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    e.stopPropagation();

    let valid = true;

    if (!nameInput.value.trim()) {
      showError(nameInput, "Name is required"); valid = false;
    }
    if (!emailInput.value.trim()) {
      showError(emailInput, "Email is required"); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      showError(emailInput, "Invalid email format"); valid = false;
    }
    if (!msgInput.value.trim()) {
      showError(msgInput, "Message is required"); valid = false;
    }

    if (!valid) return;

    const origText = submitBtn.textContent;
    setBtnState("loading", origText);

    const payload = {
      name:    nameInput.value.trim(),
      email:   emailInput.value.trim(),
      message: msgInput.value.trim()
    };

    fetch("https://formspree.io/f/mojbypwv", {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body:    JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) {
        setBtnState("success", origText);
        form.reset();
        [nameInput, emailInput, msgInput].forEach(inp => clearError(inp));
        setTimeout(() => setBtnState("reset", origText), 3500);
      } else {
        throw new Error("Server error " + res.status);
      }
    })
    .catch(err => {
      console.warn("Form send error:", err.message);
      setBtnState("error", origText);
      setTimeout(() => setBtnState("reset", origText), 3500);
    });

    return false;
  });
})();
// ========================================
// MOBILE PERFORMANCE OPTIMIZER
// ========================================
(function optimizeMobile() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isLowEnd  = navigator.hardwareConcurrency <= 4 || 
                    navigator.deviceMemory <= 2 ||
                    isAndroid;

  if (!isLowEnd) return;

  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.transition = 'opacity 0.3s ease';
      loader.style.opacity    = '0';
      setTimeout(() => loader.remove(), 600);
      document.body.classList.remove('loading');
    }, 2200); 
  }
  const heavy = [
    '.loader-ring-2',
    '.loader-ring-3',
    '.loader-scan',
    '.loader-bg-animation',
    '.loader-glow',
  ];
  heavy.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.style.display = 'none';
  });
  const canvas = document.getElementById('galaxy-network');
  if (canvas) canvas.style.display = 'none';
  const style = document.createElement('style');
  style.textContent = `
    .shooting-stars::before,
    .shooting-stars::after { animation: none !important; display: none !important; }
    .stars, .stars::before, .stars::after { animation: none !important; }
    .gradient-bg, .gradient-bg::before, .gradient-bg::after { animation: none !important; }
    body::after { animation: none !important; display: none !important; }
    .loader-emblem { animation: none !important; }
    .about-image::before { animation: none !important; }
    .orbit::before { animation: none !important; }
  `;
  document.head.appendChild(style);

})();
(function staggerCards() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const index = parseInt(card.dataset.staggerIndex || 0);
        setTimeout(() => {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.1 });

  [...document.querySelectorAll('.portfolio-card, .gallery-item')]
    .forEach((card, i) => {
      card.dataset.staggerIndex  = i;
      card.style.opacity         = '0';
      card.style.transform       = 'translateY(40px) scale(0.97)';
      card.style.transition      = 'opacity 0.6s ease, transform 0.6s ease';
      obs.observe(card);
    });
})();