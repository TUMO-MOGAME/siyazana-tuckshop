# Updating prices after handover

A draft for the owner handover (3 Dec 2026). Before then the team decides **who updates the site after 4 Dec**: a teammate, or someone the owner trusts. Write their name here: **[TO DECIDE]**.

## For the owner

1. When a price changes, or you add or stop selling something, send a WhatsApp message to **[TO DECIDE: name and number]**.
2. Say the product and the new price, for example: *"Kota Medium is now R27"*.
3. You will get a reply once the website is updated, usually the same day.

Opening hours, payment and the WhatsApp number can be changed the same way.

## For the person who updates the site

All you need is a GitHub account with access to the repo and a phone or laptop.

1. Open https://github.com/TUMO-MOGAME/siyazana-tuckshop/blob/main/data/products.json
2. Tap the pencil (**Edit**).
3. Change only the number after `"price":`. Write `27`, not `R27`.
   To add a product, copy an existing line, change it, and keep the comma at the end (the last product has no comma).
4. Tap **Commit changes**, choose **Create a new branch and start a pull request**, and write what changed and who asked:
   *"Kota Medium R25 → R27 (owner, WhatsApp 5 Dec)"*.
5. Wait for the **Tests** check to turn into a green tick. A red cross means a typo: open **Details** to see which line.
6. Merge it (or ask a teammate to approve it first, if that rule is still on). The live site updates within a few minutes.
7. Open the site on your phone, check the price, and reply to the owner.
