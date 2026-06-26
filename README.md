# MicroMints — Website

A clean, multi-page website for the MicroMints whitening-mint brand. Built with
plain HTML, CSS, and JavaScript — **no build step, no installs**. Just open it.

Brand color (mint `#2ec98d`) and the logo are drawn from `assets/logo.png`.
Includes a polished **dark mode** (remembers your choice) and subtle hover/scroll
motion throughout.

## Run it locally

Easiest — just double-click `index.html`.

For the cart/checkout to behave exactly like production (and to avoid any
browser file-path quirks), serve it over a tiny local server:

```bash
# Python (already on your machine)
python -m http.server 5500
# then visit http://localhost:5500
```

## Pages

The site is a **single-page experience**: Home, Shop, The Science, and Contact
are all sections of `index.html` that the nav scrolls to (`#top`, `#shop`,
`#science`, `#contact`). The shop/cart flow uses a few dedicated sub-pages.

| Page | File | What it does |
|------|------|--------------|
| Home (one-pager) | `index.html` | Hero → Shop grid → The Science → Contact, all in one scroll |
| Product | `product.html?id=...` | Detail page, quantity, tabs, related items |
| Cart | `cart.html` | Editable cart, promo codes, free-shipping meter |
| Checkout | `checkout.html` | Contact / shipping / payment form |
| Confirmation | `confirmation.html` | Order success + order number |

## How it's organized

```
css/style.css      Design system (all theming via CSS variables)
js/products.js     Product data + SVG graphics (tins, icons) + card builder
js/main.js         Header/footer injection, theme, nav, motion, toasts
js/cart.js         Cart logic (saved in browser) + cart/checkout rendering
js/home.js,
   product.js      Page-specific content
assets/logo.png    Your logo (used as favicon / social image)
```

## Customizing

- **Products & prices** — edit the `PRODUCTS` array in `js/products.js`.
- **Brand color** — change `--mint` (and shades) at the top of `css/style.css`.
- **Promo codes** — edit `PROMOS` in `js/cart.js` (currently `FRESH10`, `WELCOME15`, `BRIGHT20`).
- **Free-shipping threshold** — `SHIP_THRESHOLD` in `js/cart.js`.

## Going live with real payments

The cart and checkout are fully wired; only the final payment step is a demo
(`placeOrder` in `js/cart.js`). To accept real money, replace that step with
**Stripe Checkout** — typically a small serverless function that creates a
Checkout Session and redirects to Stripe. The forms and totals are already in
place to hand off.

## Deploying (free options)

Drag the whole folder onto **Netlify Drop** (netlify.com/drop), or push to
GitHub and enable **GitHub Pages**. No configuration needed — it's a static site.
