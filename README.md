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

Opening hours (confirmed by the owner, 19 Nov 2026): Monday to Friday 08:00 to 20:00; Saturday, Sunday and public holidays 08:00 to 21:00. Payment: cash or card. Collection only, no delivery.

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

## Tests

```bash
npm test
```

No installing needed (Node 20 or newer). The tests check the order total, the WhatsApp message and that every product in `data/products.json` has a valid price.

## Changing prices or products

Everything the shop sells is in [`data/products.json`](data/products.json), one line per product:

```json
{ "name": "Kota - Medium", "category": "Fast Food", "price": 25 },
```

- `price` is a plain number: `25`, not `"R25"`.
- `category` decides the heading it appears under. Categories show in the order they first appear in the file.
- Every line ends with a comma except the last product.
- Shop details at the top: `whatsapp`, `hours` (`"08:00-20:00"` format), `payment`, `delivery`. `pricesConfirmed: true` hides the "Draft prices" notice.

Only change prices after the owner confirms, and say who confirmed and when in the pull request. Every pull request runs the tests automatically: wait for the green tick before merging.

## Project layout

```
index.html                   the page (words on the page live here)
css/styles.css               design tokens (colours, sizes) at the top, then the layout
js/app.js                    loads the price file, builds the price list and the order box
js/data.js                   reads and checks products.json (tested)
js/order.js                  order total, WhatsApp message and link (tested)
data/products.json           products, prices, categories, shop details
assets/images/               shop and product photos (owner's permission required)
tests/                       npm test
docs/PLAN.md                 plan, milestones and how we work
docs/HOW-TO-PULL-REQUEST.md  step-by-step guide to branches and pull requests
```

## Status

Set up 12 November 2026. Proposal due 13 November; build starts 18 November. Prices, hours and the WhatsApp number in `data/products.json` were confirmed by the owner on 19 Nov 2026.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how we work together.
