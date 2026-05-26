// ── Loader ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  document.querySelector('.loader')?.classList.add('hide');
});

// ── Header scroll ─────────────────────────────────────────
const header = document.querySelector('.site-header');
function toggleHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', toggleHeader);
toggleHeader();

// ── Mega Menu ─────────────────────────────────────────────
const menu     = document.querySelector('.mega-menu');
const menuBtn  = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.close-menu');

function openMenu() {
  menu?.classList.add('open');
  menuBtn?.classList.add('open');
  menuBtn?.setAttribute('aria-expanded', 'true');
  menu?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
}
function closeMenu() {
  menu?.classList.remove('open');
  menuBtn?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

menuBtn?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
menu?.addEventListener('click', e => {
  if (e.target === menu || e.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ── Reveal on scroll ─────────────────────────────────────
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── To-top button ─────────────────────────────────────────
const toTop = document.querySelector('.to-top');
function toggleToTop() {
  toTop?.classList.toggle('visible', window.scrollY > 450);
}
toTop?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', toggleToTop);
toggleToTop();

// ── Review Slider ─────────────────────────────────────────
const track    = document.querySelector('.review-track');
const cards    = document.querySelectorAll('.review-card');
const nextBtn  = document.querySelector('.review-btn.next');
const prevBtn  = document.querySelector('.review-btn.prev');
let idx = 0;

function getVisible() { return window.innerWidth <= 900 ? 1 : 3; }
function updateSlider() {
  if (!track || !cards.length) return;
  const gap = parseFloat(window.getComputedStyle(track).columnGap || '0') || 0;
  const cardW = cards[0].getBoundingClientRect().width + gap;
  track.style.transform = `translateX(-${idx * cardW}px)`;
}
nextBtn?.addEventListener('click', () => {
  const max = cards.length - getVisible();
  idx = idx >= max ? 0 : idx + 1;
  updateSlider();
});
prevBtn?.addEventListener('click', () => {
  const max = cards.length - getVisible();
  idx = idx <= 0 ? max : idx - 1;
  updateSlider();
});
window.addEventListener('resize', updateSlider);
updateSlider();

// Auto-advance slider every 5 s
setInterval(() => {
  const max = cards.length - getVisible();
  idx = idx >= max ? 0 : idx + 1;
  updateSlider();
}, 5000);

// ── Animated counter for stats ────────────────────────────
function animateCounter(el, target, suffix) {
  const dur = 1600;
  const start = performance.now();
  function step(now) {
    const pct = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const val    = parseInt(el.dataset.val);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, val, suffix);
      statsObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-val]').forEach(el => statsObs.observe(el));

// ── Cookie Banner ─────────────────────────────────────────
(function () {
  const KEY    = 'nd_cookie';
  const EXP    = 24 * 60 * 60 * 1000;
  const banner = document.getElementById('cookieBanner');
  const acc    = document.getElementById('cookieAccept');
  const dec    = document.getElementById('cookieDecline');

  function valid() {
    try {
      const { ts } = JSON.parse(localStorage.getItem(KEY) || '{}');
      return ts && Date.now() - ts < EXP;
    } catch { return false; }
  }
  function save(v) {
    localStorage.setItem(KEY, JSON.stringify({ accepted: v, ts: Date.now() }));
  }

  if (!valid()) {
    if (document.readyState === 'complete') banner?.classList.add('show');
    else window.addEventListener('load', () => banner?.classList.add('show'), { once: true });
  }
  acc?.addEventListener('click', () => { save(true);  banner?.classList.remove('show'); });
  dec?.addEventListener('click', () => { save(false); banner?.classList.remove('show'); });
})();

// ── Smooth hover tilt on hero cards ──────────────────────
document.querySelectorAll('.service-card, .mega-card.featured').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// Magnetic button polish
document.querySelectorAll('.btn, .footer-cta, .float-call').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--mx', x.toFixed(2));
    el.style.setProperty('--my', y.toFixed(2));
    el.classList.add('magnetic-pop');
  });
  el.addEventListener('mouseleave', () => {
    el.classList.remove('magnetic-pop');
    el.style.removeProperty('--mx');
    el.style.removeProperty('--my');
  });
});
