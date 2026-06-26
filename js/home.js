/* ==========================================================================
   MicroMints — Homepage content (hero + marquee + shop grid)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Hero tin + floating pills
  const heroTin = document.getElementById('heroTin');
  if (heroTin) heroTin.innerHTML = tinSVG('#2ec98d', '#1b8a60');

  setPill('pill1', ICON.sparkle, 'Whitens daily');
  setPill('pill2', ICON.leaf, 'Sugar-free');
  setPill('pill3', ICON.shield, 'Enamel-safe');

  // Marquee
  const marqueeItems = ['Sugar-Free','Vegan','Enamel-Safe','No Peroxide','Hydroxyapatite','Cruelty-Free','Made in USA','Recyclable Tins'];
  const mq = document.getElementById('marquee');
  if (mq) {
    const set = marqueeItems.map(t => `<span>✦ ${t}</span>`).join('');
    mq.innerHTML = set + set; // duplicate for seamless loop
  }

  // Shop grid — all products
  const grid = document.getElementById('shopGrid');
  if (grid) {
    grid.innerHTML = PRODUCTS.map((p, i) => productCard(p, `d${(i % 4) + 1}`)).join('');
    bindAddButtons(grid);
  }

  // Science section tin
  const sci = document.getElementById('sciTin');
  if (sci) sci.innerHTML = tinSVG('#1b8a60', '#0f5f4a');

  // Contact form
  const cf = document.getElementById('contactForm');
  if (cf) {
    cf.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const msg = document.getElementById('cf-msg').value.trim();
      if (!name || !email || !msg) { toast('Please fill in all fields'); return; }
      cf.reset();
      toast('Thanks ' + name.split(' ')[0] + '! We’ll be in touch soon. 🌿', ICON.check);
    });
  }

  // Re-run reveal for newly injected nodes
  if (typeof initReveal === 'function') initReveal();
});

function setPill(id, icon, text) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `${icon}<span>${text}</span>`;
}
