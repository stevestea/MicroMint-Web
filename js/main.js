/* ==========================================================================
   MicroMints — Shared UI engine
   Header/footer injection, theme, nav, scroll motion, glow-follow, toasts.
   ========================================================================== */

/* ---------- Theme (set ASAP to avoid flash; also called inline in <head>) - */
(function initTheme() {
  const saved = localStorage.getItem('mm-theme');
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefers ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

const NAV_ITEMS = [
  { href: 'index.html#top', label: 'Home' },
  { href: 'index.html#shop', label: 'Shop' },
  { href: 'index.html#science', label: 'The Science' },
  { href: 'index.html#contact', label: 'Contact' },
];

function currentPage() {
  const p = location.pathname.split('/').pop();
  return p === '' ? 'index.html' : p;
}

/* ---------- Header ---------- */
function renderHeader() {
  const here = currentPage();
  const links = NAV_ITEMS.map(i =>
    `<a href="${i.href}" class="${i.href === here ? 'active' : ''}">${i.label}</a>`
  ).join('');

  const html = `
  <header class="site-header" id="siteHeader">
    <div class="container nav">
      <a href="index.html" class="brand" aria-label="MicroMints home">
        ${brandMark(34)}
        <span class="wordmark">Micro<b>Mints</b></span>
      </a>
      <nav class="nav-links" id="navLinks">${links}</nav>
      <div class="nav-actions">
        <button class="icon-btn" id="themeToggle" aria-label="Toggle dark mode" title="Toggle theme">
          ${ICON.moon}${ICON.sun}
        </button>
        <a href="cart.html" class="icon-btn" id="cartBtn" aria-label="View cart" title="Cart">
          ${ICON.cart}
          <span class="cart-count" id="cartCount">0</span>
        </a>
        <button class="icon-btn nav-toggle" id="navToggle" aria-label="Menu">${ICON.menu}</button>
      </div>
    </div>
  </header>`;
  document.getElementById('header')?.insertAdjacentHTML('afterbegin', html);

  // Interactions
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

/* ---------- Footer ---------- */
function renderFooter() {
  const year = new Date().getFullYear();
  const html = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col footer-about">
          <a href="index.html" class="brand">${brandMark(32)}<span class="wordmark">Micro<b>Mints</b></span></a>
          <p>Whitening mints powered by hydroxyapatite. A brighter smile and fresher breath — one tiny mint at a time.</p>
          <div class="socials">
            <a href="#" aria-label="Twitter / X">${ICON.twitter}</a>
            <a href="#" aria-label="Instagram">${ICON.instagram}</a>
            <a href="#" aria-label="TikTok">${ICON.tiktok}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <a href="index.html#shop">All Mints</a>
          <a href="product.html?id=original">Original Peppermint</a>
          <a href="product.html?id=fresh">Cool Spearmint</a>
          <a href="product.html?id=charcoal">Charcoal Detox</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="index.html#science">The Science</a>
          <a href="index.html#contact">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Get fresh updates</h4>
          <p class="muted" style="font-size:.9rem;margin-bottom:12px">Tips, launches &amp; the occasional discount.</p>
          <form class="newsletter" data-newsletter>
            <input type="email" placeholder="you@email.com" aria-label="Email" required>
            <button class="btn btn-sm" type="submit" aria-label="Subscribe">${ICON.arrow}</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} MicroMints, Inc. All rights reserved.</span>
        <span class="flex gap-2 wrap">
          <a href="#" class="muted">Privacy</a><a href="#" class="muted">Terms</a><a href="#" class="muted">Shipping</a>
        </span>
      </div>
    </div>
  </footer>`;
  document.getElementById('footer')?.insertAdjacentHTML('beforeend', html);

  document.querySelectorAll('[data-newsletter]').forEach(f =>
    f.addEventListener('submit', e => {
      e.preventDefault();
      f.reset();
      toast('You’re on the list! Check your inbox 🌿');
    })
  );
}

/* ---------- Theme toggle ---------- */
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('mm-theme', next);
}

/* ---------- Toast ---------- */
let toastWrap;
function toast(msg, icon = ICON.check) {
  if (!toastWrap) {
    toastWrap = document.createElement('div');
    toastWrap.className = 'toast-wrap';
    document.body.appendChild(toastWrap);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${icon}<span>${msg}</span>`;
  toastWrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 350);
  }, 2800);
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(e => e.classList.add('in')); return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(e => io.observe(e));
}

/* ---------- Glow-follow (cursor light on .glow surfaces) ---------- */
function initGlow() {
  document.addEventListener('pointermove', (e) => {
    const t = e.target.closest('.glow');
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty('--mx', `${e.clientX - r.left}px`);
    t.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

/* ---------- Subtle parallax tilt for [data-tilt] ---------- */
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------- Animated count-up for [data-count] ---------- */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dec = (el.dataset.count.split('.')[1] || '').length;
      let start = null;
      const dur = 1400;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec) + suffix;
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(e => io.observe(e));
}

/* ---------- Scroll-spy: highlight active nav link on the one-pager ------- */
function initScrollSpy() {
  // Map nav links by their #hash target
  const navMap = {};
  document.querySelectorAll('.nav-links a').forEach(a => {
    const hash = (a.getAttribute('href') || '').split('#')[1];
    if (hash) navMap[hash] = a;
  });
  const sections = ['shop', 'science', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return; // not on the one-pager

  const clearAll = () => Object.values(navMap).forEach(a => a.classList.remove('active'));
  const setActive = (id) => { clearAll(); navMap[id]?.classList.add('active'); };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => io.observe(s));

  // Near the very top → Home is active
  const onTop = () => { if (window.scrollY < 260) setActive('top'); };
  window.addEventListener('scroll', onTop, { passive: true });
  onTop();
}

/* ---------- Declarative icons: <i data-icon="check"></i> ---------- */
function initIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    if (ICON[name]) el.innerHTML = ICON[name];
  });
}

/* ---------- FAQ accordion ---------- */
function initAccordion() {
  document.querySelectorAll('.acc-item').forEach(item => {
    const head = item.querySelector('.acc-head');
    const body = item.querySelector('.acc-body');
    if (!head || !body) return;
    head.addEventListener('click', () => {
      const open = item.classList.contains('open');
      // close siblings within same accordion
      item.closest('.accordion')?.querySelectorAll('.acc-item.open').forEach(o => {
        if (o !== item) { o.classList.remove('open'); o.querySelector('.acc-body').style.maxHeight = null; }
      });
      item.classList.toggle('open', !open);
      body.style.maxHeight = open ? null : body.scrollHeight + 'px';
    });
  });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  if (typeof updateCartCount === 'function') updateCartCount();
  initIcons();
  initAccordion();
  initScrollSpy();
  initReveal();
  initGlow();
  initTilt();
  initCounters();
});
