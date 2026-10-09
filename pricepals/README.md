# PricePals — real UK supermarket price snapshots

Live site: **https://guyorlov.com/projects/pricepals/**

PricePals is a simple mobile barcode reader designed for children around age 10. Its price comparison now uses **real published observations**, not invented offers.

## What is connected

1. **UK Supermarket Price Scraper (Apify)** — a publicly readable, daily updated index of a limited selection of groceries from **Tesco, Sainsbury's, Asda and Aldi**. We match exact EAN/UPC barcodes, take the most recently published price for each supermarket, exclude out-of-stock online products, and link to the retailer's product page. This is a **sample basket**, not a complete catalogue and not a retailer partnership. Source: https://apify.com/yappman/uk-supermarket-price-scraper . Dataset: https://api.apify.com/v2/datasets/ynAT9NPps2EdjMOJa/items
2. **Open Prices (Open Food Facts)** — crowdsourced receipt and shelf-label prices from UK locations, filtered to GBP, UK shops, exact product barcodes and a 45-day window. We accept the most recent reported price per supermarket and display the recorded date. Source: https://prices.openfoodfacts.org/ ; API https://prices.openfoodfacts.org/api/docs .

Product names and photos also use Open Food Facts' public barcode database.

## How it works

- Scan a barcode with your phone (HTTPS + camera permission), upload a photo of a barcode, or enter an 8–14-digit number.
- Tap **Try a real UK price example** to look up barcode `5063334029012` (a Sainsbury's olive oil entry in the free daily dataset).
- We compare **only exactly matching barcodes**. Different pack sizes are **not** treated as equivalent products.
- Show up to 10 different UK supermarkets from cheapest to most expensive. If only one shop has a recorded price, show one; if none do, show **no price**, not examples or guessed values.
- Date and source are shown per record, along with any loyalty-card price published by the daily source. Normal shelf prices determine the ranking, not member-only offers.
- Page sends the barcode to public data APIs for lookup, including Apify, Open Prices and Open Food Facts. No account or API key is needed for this free integration.

## Accuracy limitations

**Not live shelf/checkout prices.** The daily dataset is refreshed by its publisher; Open Prices is contributed by volunteers. Prices, availability, promotions, loyalty schemes and delivery fees can vary by location and time. The site uses observations up to 45 days old and clearly marks recording dates. Never promise that a price is available at checkout. Open Prices entries from local branches may not match current national online shelf prices.

Some products and supermarkets are not covered. 10 results is a maximum, not a guaranteed count. We do not scrape supermarket websites in this project, and we do not have formal retailer API partnerships. An optional paid/authorised UK retailer data integration would be needed for broad near-real-time coverage.

## Licensing and credits

- UK Supermarket Price Scraper (Apify, yappman) — public dataset with attribution requested; review publisher terms before commercial redistribution: https://apify.com/yappman/uk-supermarket-price-scraper
- Open Prices / Open Food Facts — Open Database License (ODbL). Respect attribution/share-alike obligations when combining or distributing this dataset: https://openfoodfacts.github.io/open-prices/guides/data/

This is a static GitHub Pages project and does not store scan history on a server.
