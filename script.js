// ========================================
// PAGE LOADER + TEXT SCRAMBLE
// ========================================
window.addEventListener("load", () => {
  const loader = document.querySelector(".page-loader");
  const hero = document.querySelector(".hero");
  const scrambleTarget = document.querySelector(".loader-text h1");

  hero.style.opacity = "0";
  hero.style.transform = "translateY(30px)";
  hero.style.filter = "blur(6px)";
  document.body.classList.add("loading");

  // TEXT SCRAMBLE EFFECT
  const scramble = (el, finalText, duration = 1800) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";
    let frame = 0;
    const totalFrames = duration / 30;

    const interval = setInterval(() => {
      el.textContent = finalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (frame / totalFrames > i / finalText.length) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      frame++;
      if (frame >= totalFrames) {
        el.textContent = finalText;
        clearInterval(interval);
      }
    }, 30);
  };

  // Start scramble after a brief pause
  setTimeout(() => {
    if (scrambleTarget) scramble(scrambleTarget, "RISMA FANI", 1800);
  }, 500);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        loader.style.transition = "opacity 1.4s cubic-bezier(.22,1,.36,1)";
        loader.style.opacity = "0";

        hero.style.transition = "all 1.6s cubic-bezier(.22,1,.36,1)";
        hero.style.opacity = "1";
        hero.style.transform = "translateY(0)";
        hero.style.filter = "blur(0px)";

        setTimeout(() => {
          loader.remove();
          document.body.classList.remove("loading");
        }, 1400);
      }, 2800);
    });
  });
});

// ========================================
// TYPING
// ========================================
const text = ["Web Developer", "UI UX Designer", "Creative Coder", "Frontend Enthusiast"];
let count = 0;
let index = 0;

(function type() {
  if (count === text.length) count = 0;
  const currentText = text[count];
  const letter = currentText.slice(0, ++index);
  document.getElementById("typing").textContent = letter;

  if (letter.length === currentText.length) {
    count++;
    index = 0;
    setTimeout(type, 1500);
  } else {
    setTimeout(type, 90);
  }
})();

// ========================================
// SCROLL REVEAL
// ========================================
const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-zoom");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("active"), i * 160);
    }
  });
}, { threshold: .15 });
reveals.forEach(el => observer.observe(el));
// ========================================
// UNIVERSAL SCROLL REVEAL — SEMUA ELEMEN
// ========================================

const revealTargets = [
  // Section titles
  { selector: '.section-title',       delay: 0,   class: 'reveal-up' },

  // About
  { selector: '.about-stat',          delay: 100, class: 'reveal-up' },

  // Skills
  { selector: '.tech-card',           delay: 60,  class: 'reveal-up' },
  { selector: '.soft-item',           delay: 80,  class: 'reveal-up' },

  // Portfolio cards
  { selector: '.portfolio-card',      delay: 120, class: 'reveal-up' },

  // Journey cards
  { selector: '.journey-card',        delay: 100, class: 'reveal-up' },

  // Gallery
  { selector: '.gallery-item',        delay: 120, class: 'reveal-up' },

  // Contact
  { selector: '.contact-item',        delay: 80,  class: 'reveal-up' },
  { selector: '.contact-info',        delay: 0,   class: 'reveal-left' },
  { selector: '.contact-box',         delay: 0,   class: 'reveal-right' },

  // Footer
  { selector: '.footer',              delay: 0,   class: 'reveal-up' },
];

revealTargets.forEach(({ selector, delay, class: animClass }) => {
  const elements = document.querySelectorAll(selector);

  // Tambah class reveal ke elemen (kalau belum ada)
  elements.forEach(el => {
    if (!el.classList.contains('reveal') &&
        !el.classList.contains('reveal-left') &&
        !el.classList.contains('reveal-right') &&
        !el.classList.contains('reveal-up') &&
        !el.classList.contains('reveal-zoom')) {
      el.classList.add(animClass);
    }
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, i * delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => obs.observe(el));
});

// ========================================
// NAVBAR
// ========================================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
}, { passive:true });

// ========================================
// HAMBURGER
// ========================================
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

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
  if (navLinks.classList.contains("active") && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
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
window.addEventListener("scroll", () => {
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  progress.style.width = (window.pageYOffset / totalHeight) * 100 + "%";
});

// ========================================
// FORM
// ========================================
const form = document.getElementById("contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message Sent Successfully ✨");
  form.reset();
});

// ========================================
// GALAXY NETWORK
// ========================================
const galaxyCanvas = document.getElementById("galaxy-network");
const gtx = galaxyCanvas.getContext("2d");

function resizeGalaxy() {
  galaxyCanvas.width = window.innerWidth;
  galaxyCanvas.height = window.innerHeight;
}
resizeGalaxy();
window.addEventListener("resize", resizeGalaxy);

const galaxyParticles = [];
for (let i = 0; i < 45; i++) {
  galaxyParticles.push({
    x: Math.random() * galaxyCanvas.width,
    y: Math.random() * galaxyCanvas.height,
    vx: (Math.random() - .5) * 0.4,
    vy: (Math.random() - .5) * 0.4,
    size: Math.random() * 2 + 1
  });
}

function animateGalaxy() {
  gtx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
  galaxyParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > galaxyCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > galaxyCanvas.height) p.vy *= -1;
    gtx.beginPath();
    gtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    gtx.fillStyle = "rgba(180,120,255,.8)";
    gtx.fill();
  });

  for (let a = 0; a < galaxyParticles.length; a++) {
    for (let b = a; b < galaxyParticles.length; b++) {
      const dx = galaxyParticles[a].x - galaxyParticles[b].x;
      const dy = galaxyParticles[a].y - galaxyParticles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 140) {
        gtx.beginPath();
        gtx.strokeStyle = `rgba(180,120,255,${0.12 - (distance / 1400)})`;
        gtx.lineWidth = 1;
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
// CUSTOM CURSOR + STARDUST TRAIL
// ========================================
const cursor = document.querySelector(".custom-cursor");
const ring = document.querySelector(".cursor-ring");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

// Stardust trail pool
const trailColors = ["#ff7ac6", "#c4b5fd", "#6ee7ff", "#ffffff", "#ffb3e6", "#a78bfa"];
const trailPool = [];
const MAX_TRAIL = 22;

// Pre-create trail dots
for (let i = 0; i < MAX_TRAIL; i++) {
  const dot = document.createElement("div");
  dot.classList.add("stardust-dot");
  document.body.appendChild(dot);
  trailPool.push({ el: dot, x: 0, y: 0, life: 0, active: false });
}

let trailIndex = 0;
let lastTrailX = 0, lastTrailY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform =
  `translate3d(${mouseX}px, ${mouseY}px, 0)`;

  const dx = mouseX - lastTrailX;
  const dy = mouseY - lastTrailY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Spawn trail every 8px of movement
  if (dist > 8) {
    lastTrailX = mouseX;
    lastTrailY = mouseY;

    const dot = trailPool[trailIndex % MAX_TRAIL];
    trailIndex++;

    const size = 4 + Math.random() * 5;
    const color = trailColors[Math.floor(Math.random() * trailColors.length)];
    const offsetX = (Math.random() - 0.5) * 12;
    const offsetY = (Math.random() - 0.5) * 12;

    dot.el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${mouseX + offsetX}px;
      top: ${mouseY + offsetY}px;
      background: ${color};
      box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}44;
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    `;
    dot.el.classList.add("stardust-active");

    setTimeout(() => {
      dot.el.style.opacity = "0";
      dot.el.style.transform = "translate(-50%, -50%) scale(0)";
      setTimeout(() => dot.el.classList.remove("stardust-active"), 400);
    }, 50);
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  ring.style.transform =
  `translate3d(${ringX}px, ${ringY}px, 0)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button, .project-card, .timeline-card, .soft-card, .tech-card").forEach(item => {
  item.addEventListener("mouseenter", () => {
    cursor.classList.add("cursor-hover");
    ring.classList.add("cursor-ring-hover");
  });
  item.addEventListener("mouseleave", () => {
    cursor.classList.remove("cursor-hover");
    ring.classList.remove("cursor-ring-hover");
  });
});

// ========================================
// MAGNETIC BUTTON EFFECT
// ========================================
document.querySelectorAll(".btn.primary, .btn.secondary").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-5px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
    btn.style.transition = "transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease";
  });

  btn.addEventListener("mouseenter", () => {
    btn.style.transition = "transform 0.1s ease, box-shadow 0.4s ease";
  });
});

// ========================================
// PARALLAX DEPTH ON HERO
// ========================================
const heroAvatar = document.querySelector(".hero-avatar");
const heroVisual = document.querySelector(".hero-visual");
const orbit1 = document.querySelector(".orbit1");
const orbit2 = document.querySelector(".orbit2");
const orbit3 = document.querySelector(".orbit3");
const floatingIcons = document.querySelectorAll(".floating-icon");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  if (heroAvatar) heroAvatar.style.transform = `translateY(${scrollY * 0.08}px)`;
  if (orbit1) orbit1.style.transform = `translateY(${scrollY * 0.04}px) rotate(${scrollY * 0.05}deg)`;
  if (orbit2) orbit2.style.transform = `translateY(${scrollY * 0.07}px) rotate(${-scrollY * 0.03}deg)`;
  if (orbit3) orbit3.style.transform = `translateY(${scrollY * 0.11}px) rotate(${scrollY * 0.02}deg)`;
});

// Mouse parallax on hero
document.querySelector(".hero")?.addEventListener("mousemove", (e) => {
  const rect = document.querySelector(".hero").getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const mx = (e.clientX - rect.left - cx) / cx;
  const my = (e.clientY - rect.top - cy) / cy;

  if (heroAvatar) heroAvatar.style.transform = `translateY(-18px) rotateY(${mx * 8}deg) rotateX(${-my * 6}deg)`;
  if (orbit1) orbit1.style.transform = `translate(${mx * 6}px, ${my * 6}px)`;
  if (orbit2) orbit2.style.transform = `translate(${mx * 12}px, ${my * 10}px)`;
  if (orbit3) orbit3.style.transform = `translate(${mx * 18}px, ${my * 14}px)`;
});

document.querySelector(".hero")?.addEventListener("mouseleave", () => {
  if (heroAvatar) heroAvatar.style.transform = "";
  if (orbit1) orbit1.style.transform = "";
  if (orbit2) orbit2.style.transform = "";
  if (orbit3) orbit3.style.transform = "";
});

// ========================================
// TIMELINE DRAG + TOUCH SWIPE
// ========================================
const slider = document.querySelector(".timeline-scroll");
if (slider) {
  let isDragging = false, startX, scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    passive:false
    isDragging = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => { isDragging = false; slider.classList.remove("dragging"); });
  slider.addEventListener("mouseup", () => { isDragging = false; slider.classList.remove("dragging"); });
  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    slider.scrollLeft = scrollLeft - (e.pageX - slider.offsetLeft - startX) * 1.8;
  });

  let touchStartX = 0, touchScrollLeft = 0;
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchScrollLeft = slider.scrollLeft;
  }, { passive: true });
  slider.addEventListener("touchmove", (e) => {
     passive:false
    slider.scrollLeft = touchScrollLeft + (touchStartX - e.touches[0].clientX) * 1.2;
  }, { passive: true });

  if (window.innerWidth <= 768) {
    setTimeout(() => {
      slider.scrollBy({ left: 60, behavior: "smooth" });
      setTimeout(() => slider.scrollBy({ left: -60, behavior: "smooth" }), 600);
    }, 800);
  }
}

// ========================================
// SPARK ON HERO HOVER
// ========================================
const heroName = document.querySelector(".hero-visual");
const sparkColors = ["#ff7ac6", "#8b5cf6", "#6ee7ff", "#fff", "#ffb3e6", "#c4b5fd"];

heroName?.addEventListener("mousemove", (e) => {
   passive:false
  for (let i = 0; i < 6; i++) {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    const angle = Math.random() * 360;
    const distance = 40 + Math.random() * 60;
    spark.style.left = e.clientX + "px";
    spark.style.top = e.clientY + "px";
    spark.style.background = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    spark.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    spark.style.setProperty("--dy", Math.sin(angle) * distance + "px");
    spark.style.width = spark.style.height = (4 + Math.random() * 6) + "px";
    spark.style.boxShadow = `0 0 6px ${spark.style.background}`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  }
});

// ========================================
// GALLERY LIGHTBOX
// ========================================
function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (!galleryItems.length) return;

  // Create lightbox
  const lb = document.createElement("div");
  lb.className = "gallery-lightbox";
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close"><i class="fa-solid fa-xmark"></i></button>
      <button class="lb-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <button class="lb-next"><i class="fa-solid fa-chevron-right"></i></button>
      <div class="lb-img-wrap">
        <img class="lb-img" src="" alt="" />
      </div>
      <div class="lb-caption"></div>
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector(".lb-img");
  const lbCaption = lb.querySelector(".lb-caption");
  let currentIndex = 0;
  const images = [...galleryItems].map(el => ({
    src: el.dataset.src || el.querySelector("img")?.src,
    caption: el.dataset.caption || ""
  }));

  function openLightbox(i) {
    currentIndex = i;
    lbImg.style.opacity = "0";
    lbImg.src = images[i].src;
    lbCaption.textContent = images[i].caption;
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
    lbImg.onload = () => { lbImg.style.opacity = "1"; };
  }

  function closeLightbox() {
    lb.classList.remove("active");
    document.body.style.overflow = "";
  }

  function prevImg() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
  }

  function nextImg() {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener("click", () => openLightbox(i));
  });

  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", prevImg);
  lb.querySelector(".lb-next").addEventListener("click", nextImg);
  lb.querySelector(".lb-backdrop").addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImg();
    if (e.key === "ArrowRight") nextImg();
  });

  // Touch swipe for lightbox
  let lbTouchStartX = 0;
  lb.addEventListener("touchstart", (e) => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const diff = lbTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextImg() : prevImg();
  });
}

initGallery();
// ========================================
// ACTIVE NAVBAR
// ========================================
const sections = document.querySelectorAll("section[id]");
const navLink = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const top = section.offsetTop - 120;

    if (scrollY >= top) {
      current = section.getAttribute("id");
    }
  });

  navLink.forEach(link => {
    link.classList.remove("active-link");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active-link");
    }
  });
});