# Siyazana Tuckshop: online price list and WhatsApp ordering

A free, mobile-first website for **Siyazana Tuckshop**, a community tuckshop selling groceries, household essentials and fast food (Kota, chips, hot dogs, vetkoek).

Customers can see what the shop sells, the prices and the opening hours before they walk over, then send an order straight to the shop on WhatsApp. A QR code poster at the shop door links to the site.

Built for the Umuzi Experience Accelerator **Block 3 Social Gig**, 18 November to 4 December 2026.

## What it does

| Part | What the customer gets |
|---|---|
| Price list | Products by category (Fast food, Bread & milk, Groceries, Drinks) with prices |
| Shop details | Opening hours, contact details, photos |
| WhatsApp ordering | Pick items and quantities; the site writes the order message and opens WhatsApp to the shop's number. The owner confirms stock and collection. |
| QR code poster | Scan at the shop door to open the price list |

Opening hours: Monday to Friday 08:00 to 20:00, Saturday and Sunday 08:00 to 22:00.

## Team

| Member | Role |
|---|---|
| Tumo Mogame | Tech lead and developer |
| Thokozani Myeni | Partner liaison and developer |
| Anelisa Vundisa | UX/UI and content |
| Nqobile Thabethe | Project manager and marketing |

## Tech

Plain HTML, CSS and JavaScript, no build step and no paid services. Hosted free on GitHub Pages.

- Prices live in one file, [`data/products.json`](data/products.json), so a price change is a one-line edit.
- Mobile first: it must work on a 360px-wide phone with no sideways scrolling.

## Run it locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` straight from the folder blocks the price file from loading in most browsers.)

## Project layout

```
index.html            the page
data/products.json    products, prices, categories, shop details
assets/images/        shop and product photos (owner's permission required)
docs/PLAN.md          plan, milestones and how we work
```

## Status

Set up 12 November 2026. Proposal due 13 November; build starts 18 November. Prices in `data/products.json` come from the proposal and are **not yet confirmed by the owner**.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how we work together.
