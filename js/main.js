// ===== Header Scroll Effect =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('mobile-open');
});

// Close mobile menu on link click
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('mobile-open');
  });
});

// ===== Scroll Reveal Animations =====
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add('active');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Hero Rotating Text =====
const rotatingText = document.getElementById('rotatingText');
const words = ['Wafer Scrubber', 'Wafer Coater', 'Wafer Developer', 'Refurbishment & Retrofit'];
let wordIndex = 0;

function rotateWords() {
  rotatingText.style.opacity = 0;
  rotatingText.style.transform = 'translateY(10px)';
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    rotatingText.textContent = words[wordIndex];
    rotatingText.style.opacity = 1;
    rotatingText.style.transform = 'translateY(0)';
  }, 400);
}

setInterval(rotateWords, 3000);

// ===== Hero Wafer (canvas) =====
const waferCanvas = document.getElementById('wafer');
if (waferCanvas) {
  const ctx = waferCanvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let size = 0;
  let dies = [];

  const setupWafer = () => {
    const rect = waferCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = rect.width;
    waferCanvas.width = rect.width * dpr;
    waferCanvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const R = size * 0.42;
    const step = R / 7.2;
    dies = [];
    for (let y = -R; y < R; y += step) {
      for (let x = -R; x < R; x += step * 0.8) {
        const corners = [[x, y], [x + step * 0.8, y], [x, y + step], [x + step * 0.8, y + step]];
        if (corners.every(([a, b]) => Math.hypot(a, b) < R * 0.96)) {
          dies.push([x, y, step * 0.8, step, Math.random()]);
        }
      }
    }
  };

  const drawWafer = (t) => {
    const c = size / 2;
    const R = size * 0.42;
    ctx.clearRect(0, 0, size, size);

    const halo = ctx.createRadialGradient(c, c, R * 0.9, c, c, R * 1.25);
    halo.addColorStop(0, 'rgba(79,195,247,0.16)');
    halo.addColorStop(1, 'rgba(79,195,247,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(t * 0.00006);

    // wafer body with orientation notch
    ctx.beginPath();
    ctx.arc(0, 0, R, Math.PI / 2 + 0.035, Math.PI / 2 - 0.035 + Math.PI * 2);
    ctx.arc(0, R, R * 0.035, 0, Math.PI, true);
    ctx.closePath();
    const body = ctx.createLinearGradient(-R, -R, R, R);
    body.addColorStop(0, '#1b3554');
    body.addColorStop(0.45, '#0f2240');
    body.addColorStop(1, '#1d2f4e');
    ctx.fillStyle = body;
    ctx.fill();

    ctx.save();
    ctx.clip();
    const a = t * 0.00025;
    const sheen = ctx.createLinearGradient(Math.cos(a) * -R, Math.sin(a) * -R, Math.cos(a) * R, Math.sin(a) * R);
    sheen.addColorStop(0, 'rgba(79,195,247,0)');
    sheen.addColorStop(0.35, 'rgba(79,195,247,0.20)');
    sheen.addColorStop(0.5, 'rgba(186,140,255,0.16)');
    sheen.addColorStop(0.62, 'rgba(120,255,214,0.12)');
    sheen.addColorStop(1, 'rgba(79,195,247,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(-R, -R, R * 2, R * 2);
    for (const [x, y, w, h, k] of dies) {
      const pulse = 0.08 + 0.10 * (0.5 + 0.5 * Math.sin(t * 0.0012 + k * 12));
      ctx.fillStyle = `rgba(150,215,255,${pulse})`;
      ctx.fillRect(x + 1.2, y + 1.2, w - 2.4, h - 2.4);
    }
    ctx.strokeStyle = 'rgba(7,17,31,0.85)';
    ctx.lineWidth = 1.2;
    for (const [x, y, w, h] of dies) ctx.strokeRect(x, y, w, h);
    ctx.restore();

    ctx.strokeStyle = 'rgba(143,210,245,0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(c, c, R * 1.06, 0, Math.PI * 2);
    ctx.setLineDash([2, 6]);
    ctx.strokeStyle = 'rgba(143,163,184,0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    if (!reduceMotion) requestAnimationFrame(drawWafer);
  };

  setupWafer();
  drawWafer(0);
  window.addEventListener('resize', () => {
    setupWafer();
    if (reduceMotion) drawWafer(0);
  });
}

// ===== Counter Animation =====
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.dataset.target;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
