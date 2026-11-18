// Order logic with no page code in it, so it can be tested on its own (see tests/order.test.js).

import { formatRand } from "./format.js";

export const MAX_QUANTITY = 20;

/** Turns the categories in products.json into a flat list of things a customer can order.
 *  A product with options (Kota R18 / R25 / R35) becomes one orderable item per option. */
export function orderableItems(categories) {
  const items = [];
  for (const category of categories) {
    category.products.forEach((product, p) => {
      if (product.options) {
        product.options.forEach((option, o) => {
          items.push({
            key: `${category.id}-${p}-${o}`,
            name: `${product.name} (${option.label})`,
            price: option.price,
          });
        });
      } else {
        items.push({ key: `${category.id}-${p}`, name: product.name, price: product.price });
      }
    });
  }
  return items;
}

/** basket is a Map of item key -> quantity. Returns the lines in price-list order. */
export function orderLines(items, basket) {
  return items
    .filter((item) => (basket.get(item.key) || 0) > 0)
    .map((item) => {
      const quantity = basket.get(item.key);
      return { name: item.name, quantity, price: item.price, lineTotal: item.price * quantity };
    });
}

export function orderTotal(lines) {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}

export function itemCount(lines) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function changeQuantity(basket, key, change) {
  const next = Math.min(MAX_QUANTITY, Math.max(0, (basket.get(key) || 0) + change));
  if (next === 0) basket.delete(key);
  else basket.set(key, next);
  return next;
}

/** The text the customer sends to the shop on WhatsApp. */
export function orderMessage(shopName, lines, { name = "", note = "" } = {}) {
  const rows = lines.map((l) => `${l.quantity} x ${l.name} = ${formatRand(l.lineTotal)}`);
  const parts = [
    `Hi ${shopName}, I would like to order:`,
    "",
    ...rows,
    "",
    `Total: ${formatRand(orderTotal(lines))}`,
  ];
  if (name.trim()) parts.push(`Name: ${name.trim()}`);
  if (note.trim()) parts.push(`Note: ${note.trim()}`);
  parts.push("", "Please confirm stock and when I can collect.");
  return parts.join("\n");
}

/** South African number in any common format -> digits for wa.me, e.g. "082 123 4567" -> "27821234567".
 *  Returns null if it is not a usable number (for example "TO CONFIRM"). */
export function whatsappNumber(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (/^0\d{9}$/.test(digits)) return `27${digits.slice(1)}`;
  if (/^27\d{9}$/.test(digits)) return digits;
  return null;
}

/** Link that opens WhatsApp with the message filled in. With no number, WhatsApp asks who to send it to. */
export function whatsappLink(rawNumber, message) {
  const number = whatsappNumber(rawNumber);
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}
