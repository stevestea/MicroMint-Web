/* ==========================================================================
   MicroMints — Product detail page
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('pdRoot');
  if (!root) return;

  const id = new URLSearchParams(location.search).get('id') || 'original';
  const p = getProduct(id);

  if (!p) {
    root.innerHTML = `<div class="empty-state card"><h3>Product not found</h3>
      <p>We couldn’t find that mint.</p><a href="index.html#shop" class="btn">Back to shop</a></div>`;
    document.getElementById('related').innerHTML = '';
    return;
  }

  document.title = `${p.name} — MicroMints`;
  document.getElementById('crumb').innerHTML =
    `<a href="index.html">Home</a> / <a href="index.html#shop">Shop</a> / <span>${p.name}</span>`;

  const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;

  root.innerHTML = `
  <div class="pd-grid">
    <div class="pd-media glow" data-tilt>${tinSVG(p.color, p.accent)}</div>
    <div class="pd-info">
      <span class="product-flavor">${p.flavor}</span>
      <h1>${p.name}</h1>
      <div class="rating-row"><span class="stars">${ICON.star.repeat(5)}</span> ${p.rating} · ${p.reviews.toLocaleString()} reviews</div>
      <div class="pd-price">${p.compareAt ? `<s>${formatPrice(p.compareAt)}</s>` : ''}${formatPrice(p.price)}
        ${off ? `<span class="chip active" style="font-size:.8rem;vertical-align:middle">Save ${off}%</span>` : ''}
      </div>
      <p class="lead">${p.short}</p>

      <ul class="pd-benefits">
        ${p.benefits.map(b => `<li>${ICON.check}<span>${b}</span></li>`).join('')}
      </ul>

      <div class="pd-actions">
        <div class="qty">
          <button id="qDec" aria-label="Decrease">−</button>
          <input id="qInput" type="number" value="1" min="1" aria-label="Quantity">
          <button id="qInc" aria-label="Increase">+</button>
        </div>
        <button class="btn btn-lg" id="addBtn">Add to cart · <span id="lineTotal">${formatPrice(p.price)}</span></button>
      </div>

      <div class="trust-bar" style="justify-content:flex-start;gap:22px;padding-top:6px">
        <span class="ti">${ICON.truck} Free shipping $35+</span>
        <span class="ti">${ICON.recycle} 30-day returns</span>
      </div>

      <div class="pd-tabs">
        <button class="pd-tab active" data-tab="desc">Description</button>
        <button class="pd-tab" data-tab="ingredients">Ingredients</button>
        <button class="pd-tab" data-tab="usage">How to use</button>
      </div>
      <div class="pd-panel active" data-panel="desc"><p>${p.desc}</p></div>
      <div class="pd-panel" data-panel="ingredients">
        <p>${p.ingredients}</p>
        <ul class="mt-2"><li>Free from sugar, gluten & artificial colors</li><li>No peroxide or harsh abrasives</li><li>Vegan &amp; cruelty-free</li></ul>
      </div>
      <div class="pd-panel" data-panel="usage">
        <ul>
          <li>Let 1 mint dissolve after meals, up to 3× daily</li>
          <li>For best results, use consistently for 2–4 weeks</li>
          <li>Safe to use alongside regular brushing & flossing</li>
        </ul>
      </div>
    </div>
  </div>`;

  // Quantity
  const qInput = document.getElementById('qInput');
  const lineTotal = document.getElementById('lineTotal');
  const sync = () => {
    let q = Math.max(1, parseInt(qInput.value) || 1);
    qInput.value = q;
    lineTotal.textContent = formatPrice(p.price * q);
  };
  document.getElementById('qInc').addEventListener('click', () => { qInput.value = (parseInt(qInput.value)||1) + 1; sync(); });
  document.getElementById('qDec').addEventListener('click', () => { qInput.value = (parseInt(qInput.value)||1) - 1; sync(); });
  qInput.addEventListener('input', sync);
  document.getElementById('addBtn').addEventListener('click', () => addToCart(p.id, Math.max(1, parseInt(qInput.value)||1)));

  // Tabs
  root.querySelectorAll('.pd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('.pd-tab').forEach(t => t.classList.remove('active'));
      root.querySelectorAll('.pd-panel').forEach(pl => pl.classList.remove('active'));
      tab.classList.add('active');
      root.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  // Related
  const related = PRODUCTS.filter(x => x.id !== p.id).slice(0, 4);
  document.getElementById('related').innerHTML = related.map((x, i) => productCard(x, `d${(i%4)+1}`)).join('');
  bindAddButtons(document.getElementById('related'));
  if (typeof initReveal === 'function') initReveal();
});
