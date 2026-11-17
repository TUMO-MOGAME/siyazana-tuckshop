# How to make a change and get it reviewed

This is the guide we walk through at the kick-off call. You can do every step in the GitHub website, on a laptop or a phone. You don't need to install anything.

## 1. Accept your invite

Check your email or your GitHub notifications for the invite to `TUMO-MOGAME/siyazana-tuckshop` and accept it. If you don't accept it, you can't make branches.

## 2. Make a branch for your task

1. Open the repo: https://github.com/TUMO-MOGAME/siyazana-tuckshop
2. Tap the branch button (it says **main**), type a new name and tap **Create branch**.
   Name it after your task: `content/prices`, `feature/photos`, `fix/footer-text`.
3. Make sure your new branch is selected before you edit anything.

## 3. Make your change

1. Open the file, for example `data/products.json`, and tap the pencil (**Edit**).
2. Make the change. In `products.json`, keep the commas and quote marks exactly as they are around your edit.
3. Tap **Commit changes**. Write a short message that says what changed: `Update Kota prices from owner (19 Nov)`.

## 4. Open a pull request

1. GitHub shows a **Compare & pull request** button. Tap it.
2. Fill in the template: what changed, which tracker task it is, and how you tested it.
3. If you changed prices, write who confirmed them and when.
4. On the right (or under the form on a phone), choose one teammate as **Reviewer**.

## 5. Review someone else's pull request

1. Open the pull request and tap **Files changed** to read what was changed.
2. Check it against the list in [CONTRIBUTING.md](../CONTRIBUTING.md), on your own phone where you can.
3. Tap **Review changes**, then choose **Approve** or **Request changes**, and say why.

## 6. Merge

After it's approved, the person who opened the pull request taps **Merge pull request**. GitHub Pages updates the live site within a few minutes:
https://tumo-mogame.github.io/siyazana-tuckshop/

## Rules (short version)

- Never edit `main` directly.
- One task means one branch and one pull request.
- Only change prices after the owner has confirmed them.
- If you're stuck, post a screenshot in the group chat. Don't guess.
