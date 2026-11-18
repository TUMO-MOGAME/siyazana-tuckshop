// Loads data/products.json, fills in the price list, category links and opening hours,
// and runs the WhatsApp order. To change a price, edit data/products.json, never this file.

import { formatRand } from "./format.js";
import {
  orderableItems, orderLines, orderTotal, itemCount, changeQuantity,
  orderMessage, whatsappLink, whatsappNumber, MAX_QUANTITY,
} from "./order.js";

const DATA_URL = "data/products.json";
const basket = new Map();
let shop = null;
let items = [];

function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ---------- Price list ---------- */

function stepper(item) {
  const box = el("div", { class: "stepper" });
  const minus = el("button", { type: "button", class: "step", "data-key": item.key, "data-change": "-1", "aria-label": `Remove one ${item.name}` }, "−");
  const qty = el("span", { class: "qty", "data-qty": item.key, "aria-hidden": "true" }, "0");
  const plus = el("button", { type: "button", class: "step", "data-key": item.key, "data-change": "1", "aria-label": `Add one ${item.name}` }, "+");
  minus.disabled = true;
  box.append(minus, qty, plus);
  return box;
}

function row(label, priceText, item, extraClass = "") {
  const li = el("li", { class: `product ${extraClass}`.trim() });
  const text = el("span", { class: "product-text" });
  text.append(el("span", { class: "product-name" }, label));
  if (priceText) text.append(el("span", { class: "product-price" }, priceText));
  li.append(text, stepper(item));
  return li;
}

function renderPriceList(categories, container) {
  container.replaceChildren();
  const byKey = new Map(items.map((i) => [i.key, i]));
  for (const category of categories) {
    const section = el("section", { class: "category", id: category.id, "aria-labelledby": `${category.id}-heading` });
    section.append(el("h3", { id: `${category.id}-heading` }, category.name));
    const list = el("ul", { class: "products" });

    category.products.forEach((product, p) => {
      if (product.options) {
        const group = el("li", { class: "product-group" });
        group.append(el("span", { class: "product-name group-name" }, product.name));
        const options = el("ul", { class: "options", "aria-label": `${product.name} sizes` });
        product.options.forEach((option, o) => {
          const item = byKey.get(`${category.id}-${p}-${o}`);
          const label = option.label === formatRand(option.price) ? option.label : `${option.label} · ${formatRand(option.price)}`;
          options.append(row(label, "", item, "option"));
        });
        group.append(options);
        list.append(group);
      } else {
        const item = byKey.get(`${category.id}-${p}`);
        list.append(row(product.name, formatRand(product.price), item));
      }
    });

    section.append(list);
    container.append(section);
  }
}

function renderCategoryNav(categories, nav) {
  nav.replaceChildren();
  for (const category of categories) nav.append(el("a", { href: `#${category.id}` }, category.name));
  nav.append(el("a", { href: "#order" }, "Your order"), el("a", { href: "#hours" }, "Hours"));
}

function renderHours(hours, list) {
  list.replaceChildren();
  for (const h of hours) {
    const div = el("div");
    div.append(el("dt", {}, h.days), el("dd", {}, `${h.open} to ${h.close}`));
    list.append(div);
  }
}

/* ---------- Order ---------- */

function updateOrder() {
  const lines = orderLines(items, basket);
  const total = orderTotal(lines);
  const count = itemCount(lines);

  for (const item of items) {
    const q = basket.get(item.key) || 0;
    document.querySelector(`[data-qty="${item.key}"]`).textContent = q;
    document.querySelector(`[data-key="${item.key}"][data-change="-1"]`).disabled = q === 0;
    document.querySelector(`[data-key="${item.key}"][data-change="1"]`).disabled = q >= MAX_QUANTITY;
  }

  const list = document.querySelector("[data-order-lines]");
  list.replaceChildren();
  for (const l of lines) {
    const li = el("li");
    li.append(el("span", {}, `${l.quantity} x ${l.name}`), el("span", { class: "line-total" }, formatRand(l.lineTotal)));
    list.append(li);
  }
  document.querySelector("[data-order-empty]").hidden = count > 0;
  document.querySelector("[data-order-filled]").hidden = count === 0;
  document.querySelector("[data-order-total]").textContent = formatRand(total);

  const summary = count === 0 ? "No items yet" : `${count} item${count === 1 ? "" : "s"} · ${formatRand(total)}`;
  document.querySelector("[data-order-status]").textContent = count === 0 ? "Your order is empty." : `Your order: ${summary}.`;

  hasItems = count > 0;
  showOrderBar();
  document.querySelector("[data-order-bar-summary]").textContent = summary;

  updateSendLink();
}

// The bar at the bottom shows the running total, but hides while "Your order" is on screen
// so it never covers the Send button.
let hasItems = false;
let orderInView = false;

function showOrderBar() {
  const show = hasItems && !orderInView;
  document.querySelector("[data-order-bar]").hidden = !show;
  document.body.classList.toggle("has-order-bar", hasItems);
}

function watchOrderSection() {
  if (!("IntersectionObserver" in window)) return;
  new IntersectionObserver((entries) => {
    orderInView = entries[0].isIntersecting;
    showOrderBar();
  }, { threshold: 0.15 }).observe(document.querySelector("[data-order-section]"));
}

function updateSendLink() {
  const lines = orderLines(items, basket);
  const send = document.querySelector("[data-send-order]");
  const message = orderMessage(shop.name, lines, {
    name: document.querySelector("#order-name").value,
    note: document.querySelector("#order-note").value,
  });
  send.href = whatsappLink(shop.whatsapp, message);
}

function startOrdering() {
  document.querySelector("[data-test-mode]").hidden = whatsappNumber(shop.whatsapp) !== null;

  document.querySelector("[data-price-list]").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-key]");
    if (!button) return;
    changeQuantity(basket, button.dataset.key, Number(button.dataset.change));
    updateOrder();
  });

  document.querySelector("#order-name").addEventListener("input", updateSendLink);
  document.querySelector("#order-note").addEventListener("input", updateSendLink);

  document.querySelector("[data-clear-order]").addEventListener("click", () => {
    basket.clear();
    updateOrder();
    document.querySelector("#order-heading").focus();
  });

  document.querySelector("[data-order-section]").hidden = false;
  watchOrderSection();
  updateOrder();
}

/* ---------- Start ---------- */

async function start() {
  const priceList = document.querySelector("[data-price-list]");
  try {
    const response = await fetch(DATA_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    shop = data.shop;
    items = orderableItems(data.categories);

    renderPriceList(data.categories, priceList);
    renderCategoryNav(data.categories, document.querySelector("[data-category-nav]"));
    renderHours(shop.hours, document.querySelector("[data-hours]"));
    document.querySelector("[data-draft-notice]").hidden = shop.pricesConfirmed === true;
    startOrdering();
  } catch (error) {
    priceList.replaceChildren(
      el("p", { class: "error" }, "The price list could not load. Check your connection and refresh, or ask for prices at the shop.")
    );
    console.error("Could not load prices", error);
  }
}

await start();
