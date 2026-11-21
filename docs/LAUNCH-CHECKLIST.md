# Launch checklist (v1, Fri 27 Nov 2026)

Tumo runs through this before v1 goes public. Tick each item only after it has really been checked.

## Must be true before launch

- [ ] Owner approved the design and final prices (Mon 23 Nov): who, when, and how (voice note, message, in person)
- [ ] `data/products.json` matches what the owner approved; `pricesConfirmed` is `true`
- [ ] Owner has filled in the `[TO CONFIRM]` parts of `privacy.html`: full name, address, how long order chats are kept
- [ ] Owner's permission for any shop photos we put online
- [ ] "Combo" (R25) has a clear name customers will understand

## Testing

- [ ] `npm test` passes, and the **Tests** check on the pull request is green
- [ ] Android phone: price list, + and −, total, **Send order on WhatsApp** sends a real test message to the shop, and the shop receives it
- [ ] iPhone: the same test
- [ ] 360px wide (smallest phones): no sideways scrolling; menu and every button work by touch
- [ ] Chrome, Edge, Firefox and Safari: the page loads and ordering works
- [ ] Lighthouse on the live site: Performance 90 or more on desktop, and aim for 90 on mobile; Accessibility 100
- [ ] axe accessibility check: no problems
- [ ] Share the link in WhatsApp: the preview shows the orange card
- [ ] A wrong address (…/siyazana-tuckshop/abc) shows the "Page not found" page

## Switch on (launch day)

- [ ] Remove `<meta name="robots" content="noindex">` from `index.html` and `privacy.html`, and remove the "Draft" notice in `privacy.html`
- [ ] Merge through a pull request with a review, then check the live site again
- [ ] Give Nqobile the final link for the QR poster: https://tumo-mogame.github.io/siyazana-tuckshop/
- [ ] Optional: add the site to Google Search Console and submit `sitemap.xml`

## Known limits (GitHub Pages)

- GitHub Pages sets HTTPS and HSTS itself, but it can't send custom security headers, so the Content-Security-Policy is set in each page's `<meta>` tag.
- `robots.txt` only works at the root of a domain, so on `tumo-mogame.github.io/siyazana-tuckshop/` we use the `noindex` tag and `sitemap.xml` instead.
- Visitor statistics: none for now (no cookies, no tracking). If the team wants visit numbers for the impact report, pick a cookie-free tool and add it to the privacy notice first.
