/* ==========================================================================
   MicroMints — Data + SVG asset generators
   ========================================================================== */

/* ---------- Brand sunburst mark (adapts to currentColor for the petals) --- */
function brandMark(size = 34) {
  const petals = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * 45) * Math.PI / 180;
    const cx = 50 + Math.cos(a) * 31;
    const cy = 50 + Math.sin(a) * 31;
    const rot = (i * 45) + 90;
    petals.push(
      `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="4.6" ry="9.4"
        transform="rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="#7ee0bb"/>`
    );
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    ${petals.join('')}
    <circle cx="50" cy="50" r="17" fill="#2ec98d"/>
    <ellipse cx="50" cy="50" rx="4" ry="9.5" fill="#0f1714"/>
  </svg>`;
}

/* ---------- Mint-tin product graphic, tintable per flavor ---------------- */
function tinSVG(color = '#2ec98d', accent = '#1b8a60') {
  return `<svg class="tin" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="g-${color.replace('#','')}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${color}"/>
        <stop offset="1" stop-color="${accent}"/>
      </linearGradient>
    </defs>
    <!-- body -->
    <rect x="34" y="46" width="132" height="150" rx="26" fill="url(#g-${color.replace('#','')})"/>
    <rect x="34" y="46" width="132" height="150" rx="26" fill="#ffffff" opacity=".06"/>
    <!-- lid -->
    <rect x="28" y="30" width="144" height="42" rx="20" fill="#ffffff" opacity=".95"/>
    <rect x="28" y="30" width="144" height="42" rx="20" fill="${color}" opacity=".12"/>
    <!-- label band -->
    <rect x="46" y="104" width="108" height="58" rx="14" fill="#ffffff" opacity=".92"/>
    <!-- mark on label -->
    <g transform="translate(100 133) scale(.34)">
      ${(() => { const p=[]; for(let i=0;i<8;i++){const a=i*45*Math.PI/180,cx=Math.cos(a)*31,cy=Math.sin(a)*31,rot=i*45+90;p.push(`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="4.6" ry="9.4" transform="rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="${color}" opacity=".55"/>`);} return p.join(''); })()}
      <circle r="17" fill="${color}"/>
      <ellipse rx="4" ry="9.5" fill="#0f1714"/>
    </g>
    <!-- shine -->
    <rect x="44" y="56" width="14" height="120" rx="7" fill="#ffffff" opacity=".22"/>
  </svg>`;
}

/* ---------- Icon set (24px, stroke = currentColor) ----------------------- */
const ICON = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
  moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  recycle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.8a2 2 0 0 1-1.7-3l1.3-2M21 8l-1.3-2.2A2 2 0 0 0 18 5h-3M10 5l2-3 2 3M9 19h6l-3 3M14 16l1-2"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.9z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6.5L4.5 18A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.8-3L14 9.5V3"/><path d="M7 15h10"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2H21l-6.4 7.3L22 22h-6.4l-4.7-6.1L5.5 22H3l6.8-7.8L2 2h6.6l4.3 5.6zm-1.1 18h1.7L7 3.8H5.2z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.2 1.6 3.7 3.8 3.9V9.5c-1.3.1-2.6-.3-3.8-1v6.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.7a2.9 2.9 0 1 0 2 2.8V3z"/></svg>',
};

/* ---------- Products ---------------------------------------------------- */
const PRODUCTS = [
  {
    id: 'original',
    name: 'Original Peppermint',
    flavor: 'Peppermint',
    price: 14,
    compareAt: 18,
    color: '#2ec98d', accent: '#1b8a60',
    badge: 'Bestseller', badgeMint: true,
    rating: 4.9, reviews: 2148,
    short: 'Our flagship whitening mint. Cool, crisp peppermint that brightens as it freshens.',
    benefits: [
      'Hydroxyapatite gently lifts surface stains',
      'Sugar-free & enamel-safe',
      'Fresh breath for hours',
      '45 mints per tin (~1 month)',
    ],
    tags: ['whitening', 'sugar-free', 'bestseller'],
    desc: 'The mint that started it all. Each MicroMints Original is packed with nano-hydroxyapatite — the same mineral your enamel is made of — to gently polish away coffee, tea, and wine stains while you go about your day. No peroxide, no sensitivity, just a brighter smile and breath that lasts.',
    ingredients: 'Sorbitol, Xylitol, Nano-Hydroxyapatite, Natural Peppermint Oil, Magnesium Stearate, Citric Acid, Stevia.',
  },
  {
    id: 'fresh',
    name: 'Cool Spearmint',
    flavor: 'Spearmint',
    price: 14, compareAt: 18,
    color: '#34c98d', accent: '#178f8a',
    badge: 'Fan Favorite',
    rating: 4.8, reviews: 1276,
    short: 'Smooth, sweet spearmint with the same whitening power — a softer, rounder finish.',
    benefits: ['Nano-hydroxyapatite whitening','Mellow, sweet spearmint','Sugar-free & vegan','45 mints per tin'],
    tags: ['whitening','sugar-free','vegan'],
    desc: 'For those who find peppermint a touch sharp, Cool Spearmint delivers the exact same stain-lifting formula with a smoother, sweeter profile. A favorite for after lunch and before meetings.',
    ingredients: 'Sorbitol, Xylitol, Nano-Hydroxyapatite, Natural Spearmint Oil, Magnesium Stearate, Citric Acid, Stevia.',
  },
  {
    id: 'charcoal',
    name: 'Charcoal Detox',
    flavor: 'Peppermint + Charcoal',
    price: 16, compareAt: 20,
    color: '#3aa985', accent: '#0f5f4a',
    badge: 'New', badgeMint: false,
    rating: 4.7, reviews: 643,
    short: 'Activated charcoal meets peppermint for a deeper polish and an extra-clean feel.',
    benefits: ['Activated charcoal + hydroxyapatite','Deep surface-stain lift','Sugar-free','40 mints per tin'],
    tags: ['whitening','charcoal','deep-clean'],
    desc: 'Our most powerful daily polish. Food-grade activated charcoal binds to surface stains while nano-hydroxyapatite remineralizes — together they leave teeth feeling freshly cleaned, with a bold peppermint kick.',
    ingredients: 'Sorbitol, Xylitol, Nano-Hydroxyapatite, Activated Coconut Charcoal, Natural Peppermint Oil, Magnesium Stearate, Stevia.',
  },
];

function getProduct(id) { return PRODUCTS.find(p => p.id === id); }
function formatPrice(n) { return '$' + Number(n).toFixed(2); }

/* ---------- Reusable product card (home + shop) -------------------------- */
function productCard(p, delayClass = '') {
  const badge = p.badge ? `<span class="product-badge ${p.badgeMint ? 'mint' : ''}">${p.badge}</span>` : '';
  return `
  <article class="card card-hover glow product-card reveal ${delayClass}">
    <a href="product.html?id=${p.id}" class="product-media" aria-label="${p.name}">
      ${badge}
      ${tinSVG(p.color, p.accent)}
    </a>
    <div class="product-body">
      <span class="product-flavor">${p.flavor}</span>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="product-desc">${p.short}</p>
      <div class="rating-row"><span class="stars">${ICON.star.repeat(5)}</span> ${p.rating} · ${p.reviews.toLocaleString()} reviews</div>
      <div class="product-foot">
        <span class="price">${p.compareAt ? `<s>${formatPrice(p.compareAt)}</s>` : ''}${formatPrice(p.price)}</span>
        <button class="btn btn-sm" data-add="${p.id}">Add ${ICON.plus}</button>
      </div>
    </div>
  </article>`;
}

/* ---------- Wire up every [data-add] button within a root --------------- */
function bindAddButtons(root) {
  root.querySelectorAll('[data-add]').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(btn.dataset.add, 1);
    });
  });
}
