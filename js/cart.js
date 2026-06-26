/* ==========================================================================
   MicroMints — Cart (localStorage-backed)
   ========================================================================== */

const CART_KEY = 'mm-cart';
const SHIP_THRESHOLD = 35;   // free shipping over this
const SHIP_COST = 4.95;
const TAX_RATE = 0.0;        // display only; adjust as needed
const PROMOS = { FRESH10: 0.10, BRIGHT20: 0.20, WELCOME15: 0.15 };

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function cartCountTotal() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

function addToCart(id, qty = 1) {
  const p = getProduct(id);
  if (!p) return;
  const cart = getCart();
  const line = cart.find(i => i.id === id);
  if (line) line.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
  bumpCartIcon();
  toast(`${p.name} added to cart`, ICON.check);
}
function setQty(id, qty) {
  const cart = getCart();
  const line = cart.find(i => i.id === id);
  if (!line) return;
  line.qty = Math.max(1, qty);
  saveCart(cart);
}
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const n = cartCountTotal();
  el.textContent = n;
  el.classList.toggle('show', n > 0);
}
function bumpCartIcon() {
  const btn = document.getElementById('cartBtn');
  if (!btn) return;
  btn.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(1)' }],
    { duration: 420, easing: 'cubic-bezier(.22,.61,.36,1)' }
  );
}

/* ---------- Totals ---------- */
function getTotals(promoCode) {
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + (getProduct(i.id)?.price || 0) * i.qty, 0);
  let discount = 0;
  const code = (promoCode || '').toUpperCase();
  if (PROMOS[code]) discount = subtotal * PROMOS[code];
  const afterDiscount = subtotal - discount;
  const shipping = cart.length === 0 ? 0 : (afterDiscount >= SHIP_THRESHOLD ? 0 : SHIP_COST);
  const tax = afterDiscount * TAX_RATE;
  const total = afterDiscount + shipping + tax;
  return { subtotal, discount, shipping, tax, total, count: cartCountTotal() };
}

/* ---------- Cart page render ---------- */
let activePromo = sessionStorage.getItem('mm-promo') || '';

function renderCartPage() {
  const root = document.getElementById('cartRoot');
  if (!root) return;
  const cart = getCart();

  if (cart.length === 0) {
    root.innerHTML = `
      <div class="empty-state card">
        ${ICON.cart}
        <h3>Your cart is empty</h3>
        <p>Looks like you haven’t added any mints yet. Let’s fix that.</p>
        <a href="index.html#shop" class="btn">Browse the mints ${ICON.arrow}</a>
      </div>`;
    return;
  }

  const items = cart.map(i => {
    const p = getProduct(i.id);
    return `
    <div class="cart-item" data-id="${p.id}">
      <a href="product.html?id=${p.id}" class="thumb">${tinSVG(p.color, p.accent)}</a>
      <div>
        <span class="ci-flavor">${p.flavor}</span>
        <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
        <div class="ci-meta">
          <div class="qty-sm">
            <button data-act="dec" aria-label="Decrease">−</button>
            <span>${i.qty}</span>
            <button data-act="inc" aria-label="Increase">+</button>
          </div>
          <button class="ci-remove" data-act="remove">${ICON.trash} Remove</button>
        </div>
      </div>
      <div class="ci-price">${formatPrice(p.price * i.qty)}</div>
    </div>`;
  }).join('');

  root.innerHTML = `
    <div class="cart-layout">
      <div>
        <div class="flex between items-center mb-2">
          <h3>${cartCountTotal()} item${cartCountTotal() > 1 ? 's' : ''}</h3>
          <a href="index.html#shop" class="muted" style="font-weight:600">Continue shopping →</a>
        </div>
        <div class="card" style="padding:6px 24px">${items}</div>
      </div>
      ${summaryHTML(true)}
    </div>`;

  bindCartEvents(root);
  bindSummaryEvents(root);
}

function bindCartEvents(root) {
  root.querySelectorAll('.cart-item').forEach(row => {
    const id = row.dataset.id;
    row.querySelector('[data-act="inc"]').addEventListener('click', () => {
      setQty(id, (getCart().find(i => i.id === id)?.qty || 1) + 1); renderCartPage();
    });
    row.querySelector('[data-act="dec"]').addEventListener('click', () => {
      setQty(id, (getCart().find(i => i.id === id)?.qty || 1) - 1); renderCartPage();
    });
    row.querySelector('[data-act="remove"]').addEventListener('click', () => {
      row.style.opacity = '0'; row.style.transform = 'translateX(20px)';
      setTimeout(() => { removeFromCart(id); renderCartPage(); }, 200);
    });
  });
}

/* ---------- Order summary (shared cart + checkout) ---------- */
function summaryHTML(withPromo, withCheckoutBtn = true) {
  const t = getTotals(activePromo);
  const remaining = SHIP_THRESHOLD - (t.subtotal - t.discount);
  return `
    <aside class="summary">
      <h3>Order summary</h3>
      ${remaining > 0 && t.subtotal > 0 ? `
        <div class="chip" style="width:100%;justify-content:center;margin-bottom:14px">
          ${ICON.truck} Add ${formatPrice(remaining)} for free shipping
        </div>` : ''}
      ${withPromo ? `
        <div class="promo">
          <input id="promoInput" placeholder="Promo code" value="${activePromo}">
          <button class="btn btn-sm" id="promoApply">Apply</button>
        </div>
        <p class="muted" style="font-size:.8rem;margin-bottom:10px">Try <b>FRESH10</b>, <b>WELCOME15</b> or <b>BRIGHT20</b></p>
      ` : ''}
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(t.subtotal)}</span></div>
      ${t.discount > 0 ? `<div class="summary-row" style="color:var(--mint-700)"><span>Discount (${activePromo.toUpperCase()})</span><span>−${formatPrice(t.discount)}</span></div>` : ''}
      <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : formatPrice(t.shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(t.total)}</span></div>
      ${withCheckoutBtn ? `<a href="checkout.html" class="btn btn-block btn-lg mt-3">Checkout ${ICON.lock}</a>
      <div class="trust-bar" style="justify-content:center;gap:18px;padding-top:14px">
        <span class="ti">${ICON.shield} Secure</span>
        <span class="ti">${ICON.recycle} 30-day returns</span>
      </div>` : ''}
    </aside>`;
}

function bindSummaryEvents(root) {
  const apply = root.querySelector('#promoApply');
  if (!apply) return;
  apply.addEventListener('click', () => {
    const code = root.querySelector('#promoInput').value.trim().toUpperCase();
    if (PROMOS[code]) {
      activePromo = code; sessionStorage.setItem('mm-promo', code);
      toast(`Promo ${code} applied — ${Math.round(PROMOS[code]*100)}% off!`, ICON.sparkle);
    } else {
      activePromo = ''; sessionStorage.removeItem('mm-promo');
      toast('That code isn’t valid', ICON.flask);
    }
    renderCartPage();
  });
}

/* ---------- Checkout page render ---------- */
function renderCheckoutPage() {
  const root = document.getElementById('checkoutRoot');
  if (!root) return;
  const cart = getCart();

  if (cart.length === 0) {
    root.innerHTML = `
      <div class="empty-state card">
        ${ICON.cart}<h3>Nothing to check out</h3>
        <p>Your cart is empty — add some mints first.</p>
        <a href="index.html#shop" class="btn">Browse the mints ${ICON.arrow}</a>
      </div>`;
    return;
  }

  const t = getTotals(activePromo);
  const miniItems = cart.map(i => {
    const p = getProduct(i.id);
    return `<div class="mini-item">
      <div class="thumb">${tinSVG(p.color, p.accent)}<span class="qbadge">${i.qty}</span></div>
      <span class="mi-name">${p.name}</span>
      <span class="mi-price">${formatPrice(p.price * i.qty)}</span>
    </div>`;
  }).join('');

  root.innerHTML = `
  <form class="checkout-layout" id="checkoutForm" novalidate>
    <div>
      <div class="checkout-step">
        <h3><span class="sn">1</span> Contact</h3>
        <div class="field">
          <label for="ck-email">Email address</label>
          <input class="input" id="ck-email" type="email" placeholder="you@email.com" required>
        </div>
      </div>

      <div class="checkout-step">
        <h3><span class="sn">2</span> Shipping address</h3>
        <div class="row-2">
          <div class="field"><label>First name</label><input class="input" required placeholder="Jordan"></div>
          <div class="field"><label>Last name</label><input class="input" required placeholder="Avery"></div>
        </div>
        <div class="field"><label>Street address</label><input class="input" required placeholder="123 Fresh St"></div>
        <div class="row-2">
          <div class="field"><label>City</label><input class="input" required placeholder="Portland"></div>
          <div class="field"><label>ZIP / Postal</label><input class="input" required placeholder="97201"></div>
        </div>
        <div class="field"><label>Country</label>
          <select class="input">
            <option>United States</option><option>Canada</option><option>United Kingdom</option>
            <option>Australia</option><option>Germany</option><option>Other</option>
          </select>
        </div>
      </div>

      <div class="checkout-step">
        <h3><span class="sn">3</span> Payment</h3>
        <div class="pay-row">
          <label class="pay-opt active"><input type="radio" name="pay" checked hidden>${ICON.lock} Card</label>
          <label class="pay-opt"><input type="radio" name="pay" hidden>PayPal</label>
          <label class="pay-opt"><input type="radio" name="pay" hidden>Apple Pay</label>
        </div>
        <div id="cardFields">
          <div class="field"><label>Card number</label><input class="input" inputmode="numeric" placeholder="4242 4242 4242 4242"></div>
          <div class="row-2">
            <div class="field"><label>Expiry</label><input class="input" placeholder="MM / YY"></div>
            <div class="field"><label>CVC</label><input class="input" placeholder="123"></div>
          </div>
        </div>
        <p class="muted" style="font-size:.84rem">${ICON.shield} This is a demo checkout — no real payment is processed. Wire up Stripe to go live.</p>
      </div>
    </div>

    <aside class="summary">
      <h3>Your order</h3>
      <div style="margin-bottom:14px">${miniItems}</div>
      <hr class="divider mb-2">
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(t.subtotal)}</span></div>
      ${t.discount > 0 ? `<div class="summary-row" style="color:var(--mint-700)"><span>Discount</span><span>−${formatPrice(t.discount)}</span></div>` : ''}
      <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : formatPrice(t.shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(t.total)}</span></div>
      <button class="btn btn-block btn-lg mt-3" type="submit">Pay ${formatPrice(t.total)}</button>
      <div class="trust-bar" style="justify-content:center;gap:18px;padding-top:14px">
        <span class="ti">${ICON.lock} SSL secured</span>
        <span class="ti">${ICON.recycle} 30-day returns</span>
      </div>
    </aside>
  </form>`;

  // Payment option toggle
  root.querySelectorAll('.pay-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      root.querySelectorAll('.pay-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const isCard = opt.textContent.includes('Card');
      root.querySelector('#cardFields').style.display = isCard ? '' : 'none';
    });
  });

  // Submit -> confirmation
  root.querySelector('#checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = root.querySelector('#ck-email').value.trim();
    if (!email) { root.querySelector('#ck-email').focus(); toast('Please enter your email', ICON.mail); return; }
    placeOrder(t, email);
  });
}

function placeOrder(t, email) {
  const orderId = 'MM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  sessionStorage.setItem('mm-order', JSON.stringify({ orderId, total: t.total, email }));
  localStorage.removeItem(CART_KEY);
  sessionStorage.removeItem('mm-promo');
  updateCartCount();
  location.href = 'confirmation.html';
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
  renderCheckoutPage();
});
