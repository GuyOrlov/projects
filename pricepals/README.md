# PricePals — mobile barcode price comparison layout

A single-page mobile website designed to be easy for a 10-year-old to understand.

## What already works
- Colourful responsive mobile design, large buttons and clear UK £ prices.
- Camera barcode scanning, using `html5-qrcode` v2.3.8 (internet required, camera requires HTTPS or localhost, and permission).
- Upload an image of a barcode, or type an 8–14 digit barcode.
- Food product name/image lookup via the public Open Food Facts API when available.
- Ten **fictional example shops** and **made-up example prices** for the demo.
- Price offers sorted from cheapest at top to most expensive at bottom, with savings comparisons.

## Important: real prices are NOT connected
Open Food Facts can identify some products, but it does not provide an authoritative live price feed for 10 UK retailers. To show real shop offers, connect your licensed data source or backend to a price feed. Do **not** give users the example prices as actual retail prices.

An integration hook is ready in `index.html`: update `PRICE_API_URL = ''` near the beginning of the script. It expects an HTTPS endpoint taking `?barcode=...` and replying:

```json
{
  "offers": [
    { "shop": "Shop Name", "price": 1.49, "url": "https://shop.example/product" },
    { "shop": "Another Shop", "price": 1.79, "url": "https://another.example/product" }
  ]
}
```

The page sorts offers ascending and displays the cheapest 10. Use a server-side provider for any API credentials, and make sure the feed is allowed to be displayed publicly. Check matching product **size and variant** before comparing; add last-updated times and delivery costs to a production version. If the price feed is missing or unavailable, the page clearly falls back to demo mode.

## Run it
Upload `index.html` to GitHub Pages, Netlify, Vercel, or another HTTPS static host. For local development run `python -m http.server 8000` in this folder, then visit `http://localhost:8000`. Camera access requires user permission and browser support.