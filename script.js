// ========================================
// PERFORMANCE UTILS
// ========================================
const isMobile = () => window.innerWidth <= 900 || ('ontouchstart' in window);

// Throttle: panggil fn max sekali per `limit` ms
function throttle(fn, limit) {
  let last = 0;
  return function (...args) {
    const now = performance.now();
    if (now - last >= limit) { last = now; fn.apply(this, args); }
  };
}

// RAF-gated: jadwalkan fn di frame berikutnya, skip jika sudah pending
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
  const loader    = document.querySelector(".page-loader");
  const hero      = document.querySelector(".hero");
  const scrambleTarget = document.querySelector(".loader-text h1");

  hero.style.opacity   = "0";
  hero.style.transform = "translateY(30px)";
  hero.style.filter    = "blur(6px)";
  document.body.classList.add("loading");

  // TEXT SCRAMBLE — dipercepat & pakai rAF agar tidak block
  const scramble = (el, finalText, duration = 1400) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";
    const total = Math.round(duration / 30);
    let frame = 0;
    let rafId;

    const step = () => {
      el.textContent = finalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (frame / total > i / finalText.length) return char;
          return chars[(Math.random() * chars.length) | 0];
        })
        .join("");
      frame++;
      if (frame < total) rafId = requestAnimationFrame(step);
      else el.textContent = finalText;
    };
    rafId = requestAnimationFrame(step);
  };

  setTimeout(() => {
    if (scrambleTarget) scramble(scrambleTarget, "RISMA FANI", 1400);
  }, 400);

  // Loader hide dipercepat: 2400ms (was 2800ms)
  setTimeout(() => {
    loader.style.transition = "opacity 1.2s cubic-bezier(.22,1,.36,1)";
    loader.style.opacity    = "0";

    hero.style.transition = "all 1.4s cubic-bezier(.22,1,.36,1)";
    hero.style.opacity    = "1";
    hero.style.transform  = "translateY(0)";
    hero.style.filter     = "blur(0px)";

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
      revealObs.unobserve(entry.target); // unobserve setelah active
    }
  });
}, { threshold: .12 });
reveals.forEach(el => revealObs.observe(el));

// ========================================
// UNIVERSAL SCROLL REVEAL
// ========================================
const revealTargets = [
  { selector: '.section-title',  delay: 0,   class: 'reveal-up'    },
  { selector: '.about-stat',     delay: 80,  class: 'reveal-up'    },
  { selector: '.tech-card',      delay: 50,  class: 'reveal-up'    },
  { selector: '.soft-item',      delay: 60,  class: 'reveal-up'    },
  { selector: '.portfolio-card', delay: 100, class: 'reveal-up'    },
  { selector: '.journey-card',   delay: 80,  class: 'reveal-up'    },
  { selector: '.gallery-item',   delay: 100, class: 'reveal-up'    },
  { selector: '.contact-item',   delay: 60,  class: 'reveal-up'    },
  { selector: '.contact-info',   delay: 0,   class: 'reveal-left'  },
  { selector: '.contact-box',    delay: 0,   class: 'reveal-right' },
  { selector: '.footer',         delay: 0,   class: 'reveal-up'    },
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
// NAVBAR
// ========================================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", rafThrottle(() => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
}), { passive: true });

// ========================================
// HAMBURGER
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
  else if (!navLinks.classList.contains("active")) navLinks.setAttribute("aria-hidden", "true");
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
document.addEventListener("click", (e) => {
  if (navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)) closeMenu();
});

// ========================================
// THEME
// ========================================
const toggle = document.getElementById("themeToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem("theme") === "light") document.body.classList.add("light");

// ========================================
// SCROLL PROGRESS
// ========================================
const progress = document.querySelector(".scroll-progress");
window.addEventListener("scroll", rafThrottle(() => {
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  progress.style.width = (window.pageYOffset / totalHeight) * 100 + "%";
}), { passive: true });

// ========================================
// GALAXY NETWORK — dioptimasi O(n²) → hanya render kalau visible
// ========================================
const galaxyCanvas = document.getElementById("galaxy-network");
const gtx = galaxyCanvas.getContext("2d");
let galaxyVisible = true;

// Hanya animasikan kalau tab visible
document.addEventListener("visibilitychange", () => {
  galaxyVisible = !document.hidden;
});

function resizeGalaxy() {
  galaxyCanvas.width  = window.innerWidth;
  galaxyCanvas.height = window.innerHeight;
}
resizeGalaxy();
window.addEventListener("resize", throttle(resizeGalaxy, 300));

// Kurangi jumlah partikel di mobile (was 45 di semua device)
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

// Jarak koneksi dikurangi mobile
const CONNECT_DIST = isMobile() ? 90 : 130;

function animateGalaxy() {
  if (!galaxyVisible) { requestAnimationFrame(animateGalaxy); return; }

  gtx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

  const len = galaxyParticles.length;

  // Update posisi
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

  // Koneksi antar partikel — hanya kalau jarak cukup dekat
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
// CUSTOM CURSOR + STARDUST TRAIL — hanya desktop
// ========================================
if (!isMobile()) {
  const cursor = document.querySelector(".custom-cursor");
  const ring   = document.querySelector(".cursor-ring");
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  const trailColors = ["#ff7ac6","#c4b5fd","#6ee7ff","#ffffff","#ffb3e6","#a78bfa"];
  const MAX_TRAIL   = 14; // was 22
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
    if (dx * dx + dy * dy > 100) { // jarak > 10px (was 8px)
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
  }, 16)); // ~60fps throttle

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll("a, button, .project-card, .timeline-card, .soft-card, .tech-card").forEach(item => {
    item.addEventListener("mouseenter", () => { cursor.classList.add("cursor-hover"); ring.classList.add("cursor-ring-hover"); });
    item.addEventListener("mouseleave", () => { cursor.classList.remove("cursor-hover"); ring.classList.remove("cursor-ring-hover"); });
  });
}

// ========================================
// MAGNETIC BUTTON EFFECT — hanya desktop
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
// PARALLAX — hanya desktop, RAF-throttled
// ========================================
const heroAvatar    = document.querySelector(".hero-avatar");
const orbit1El      = document.querySelector(".orbit1");
const orbit2El      = document.querySelector(".orbit2");
const orbit3El      = document.querySelector(".orbit3");

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
// SPARK ON HERO HOVER — dimatikan di mobile
// ========================================
if (!isMobile()) {
  const heroVisual = document.querySelector(".hero-visual");
  const sparkColors = ["#ff7ac6","#8b5cf6","#6ee7ff","#fff","#ffb3e6","#c4b5fd"];

  heroVisual?.addEventListener("mousemove", throttle((e) => {
    for (let i = 0; i < 4; i++) { // was 6
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
  }, 60)); // throttle ke 60ms (was tanpa throttle)
}

// ========================================
// TIMELINE DRAG + TOUCH SWIPE — dioptimasi
// ========================================
const slider = document.querySelector(".timeline-scroll");
if (slider) {
  let isDragging = false, startX = 0, scrollLeft = 0;
  let velocity = 0, lastDragX = 0, momentumId;

  const stopMomentum = () => { cancelAnimationFrame(momentumId); velocity = 0; };

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    slider.classList.add("dragging");
    startX    = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    lastDragX = e.pageX;
    stopMomentum();
  });
  slider.addEventListener("mouseleave", () => { isDragging = false; slider.classList.remove("dragging"); });
  slider.addEventListener("mouseup",    () => {
    isDragging = false;
    slider.classList.remove("dragging");
    // Momentum scroll setelah lepas
    const startMomentum = () => {
      if (Math.abs(velocity) < 0.5) return;
      slider.scrollLeft -= velocity;
      velocity *= 0.92;
      momentumId = requestAnimationFrame(startMomentum);
    };
    startMomentum();
  });
  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x  = e.pageX - slider.offsetLeft;
    const dx = x - startX;
    velocity = e.pageX - lastDragX;
    lastDragX = e.pageX;
    slider.scrollLeft = scrollLeft - dx * 1.6;
  });

  // Touch swipe — lebih responsif
  let touchStartX = 0, touchScrollLeft = 0, touchVelocity = 0, lastTouchX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX    = e.touches[0].clientX;
    touchScrollLeft = slider.scrollLeft;
    lastTouchX     = touchStartX;
    touchVelocity  = 0;
    stopMomentum();
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    const tx     = e.touches[0].clientX;
    touchVelocity = lastTouchX - tx;
    lastTouchX   = tx;
    slider.scrollLeft = touchScrollLeft + (touchStartX - tx) * 1.1;
  }, { passive: true });

  slider.addEventListener("touchend", () => {
    const momentum = () => {
      if (Math.abs(touchVelocity) < 0.5) return;
      slider.scrollLeft += touchVelocity;
      touchVelocity *= 0.93;
      momentumId = requestAnimationFrame(momentum);
    };
    momentum();
  }, { passive: true });

  // Swipe hint di mobile
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
    lbImg.style.opacity = "0";
    lbImg.src           = images[i].src;
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
// ACTIVE NAVBAR
// ========================================
const sections = document.querySelectorAll("section[id]");
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