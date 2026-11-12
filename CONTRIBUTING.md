# How we work

## Branches and pull requests

1. Never push straight to `main`. `main` is what is live on GitHub Pages.
2. One task from the tracker = one branch: `feature/whatsapp-order`, `content/prices`, `fix/menu-on-small-phones`.
3. Open a pull request into `main`, fill in the template, and ask one teammate to review.
4. The reviewer opens the page on their own phone before approving.
5. The person who opened the pull request merges it after approval.

## Commits

Short, present tense, says what changed: `Add drinks category`, `Fix order total for quantities over 9`.

## Prices and shop details

Only change prices in `data/products.json`, and only after the owner has confirmed them. Note who confirmed and when in the pull request.

## Before any merge

- [ ] Works on a 360px-wide phone, no sideways scrolling
- [ ] Text is large and readable; buttons are easy to tap
- [ ] The WhatsApp order message is correct (items, quantities, total)
- [ ] No personal details other than the shop's own public contact details
