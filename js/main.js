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

// ===== Hero Particles =====
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 8 + 's';
  particle.style.animationDuration = (5 + Math.random() * 5) + 's';
  particle.style.width = (2 + Math.random() * 3) + 'px';
  particle.style.height = particle.style.width;
  particlesContainer.appendChild(particle);
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
