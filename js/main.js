/* main.js — Jonathan Sung Portfolio */

/* ── Nav scroll effect ─────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile menu toggle ────────────────────────── */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity  = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Reveal on scroll ──────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero reveals immediately on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero .reveal').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
});

/* ── Carousel ──────────────────────────────────── */
const track = document.getElementById('carouselTrack');
const cards = document.querySelectorAll('.project-card');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => scrollToCard(i));
  dotsContainer.appendChild(dot);
});

function getCardWidth() {
  // card width + gap
  return cards[0].offsetWidth + 24;
}

function getTrackOffset() {
  // The ::before pseudo-element pads the start — we account for it by
  // reading the first card's left position relative to the track
  return cards[0].offsetLeft;
}

function scrollToCard(index) {
  currentIndex = Math.max(0, Math.min(index, cards.length - 1));
  const offset = getTrackOffset() + currentIndex * getCardWidth();
  track.scrollTo({ left: offset, behavior: 'smooth' });
  updateDots();
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

prevBtn.addEventListener('click', () => scrollToCard(currentIndex - 1));
nextBtn.addEventListener('click', () => scrollToCard(currentIndex + 1));

// Sync dots when user drags / scrolls manually
let scrollTimeout;
track.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const offset = track.scrollLeft - getTrackOffset();
    const cardW = getCardWidth();
    currentIndex = Math.round(offset / cardW);
    currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
    updateDots();
  }, 80);
});

/* ── Carousel drag (mouse) ─────────────────────── */
let isDragging = false;
let dragStartX = 0;
let dragScrollLeft = 0;

track.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStartX = e.pageX - track.offsetLeft;
  dragScrollLeft = track.scrollLeft;
  track.classList.add('grabbing');
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - track.offsetLeft;
  const walk = (x - dragStartX) * 1.4;
  track.scrollLeft = dragScrollLeft - walk;
});

window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  track.classList.remove('grabbing');
  // Snap to nearest card
  const offset = track.scrollLeft - getTrackOffset();
  const cardW = getCardWidth();
  const nearest = Math.round(offset / cardW);
  scrollToCard(nearest);
});

/* ── Keyboard nav for carousel ─────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  scrollToCard(currentIndex - 1);
  if (e.key === 'ArrowRight') scrollToCard(currentIndex + 1);
});