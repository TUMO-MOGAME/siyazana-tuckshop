// Loads data/products.json and fills in the price list, category links and opening hours.
// To change a price, edit data/products.json, never this file.

import { formatRand } from "./format.js";

const DATA_URL = "data/products.json";

function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderProduct(product) {
  const item = el("li", { class: "product" });
  item.append(el("span", { class: "product-name" }, product.name));

  const price = product.options
    ? product.options.map((o) => formatRand(o.price)).join(" / ")
    : formatRand(product.price);
  item.append(el("span", { class: "product-price" }, price));
  return item;
}

function renderPriceList(categories, container) {
  container.replaceChildren();
  for (const category of categories) {
    const section = el("section", { class: "category", id: category.id, "aria-labelledby": `${category.id}-heading` });
    section.append(el("h3", { id: `${category.id}-heading` }, category.name));
    const list = el("ul", { class: "products" });
    for (const product of category.products) list.append(renderProduct(product));
    section.append(list);
    container.append(section);
  }
}

function renderCategoryNav(categories, nav) {
  nav.replaceChildren();
  for (const category of categories) {
    nav.append(el("a", { href: `#${category.id}` }, category.name));
  }
  nav.append(el("a", { href: "#hours" }, "Hours"));
}

function renderHours(hours, list) {
  list.replaceChildren();
  for (const row of hours) {
    const div = el("div");
    div.append(el("dt", {}, row.days), el("dd", {}, `${row.open} to ${row.close}`));
    list.append(div);
  }
}

async function start() {
  const priceList = document.querySelector("[data-price-list]");
  try {
    const response = await fetch(DATA_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    renderPriceList(data.categories, priceList);
    renderCategoryNav(data.categories, document.querySelector("[data-category-nav]"));
    renderHours(data.shop.hours, document.querySelector("[data-hours]"));
    document.querySelector("[data-draft-notice]").hidden = data.shop.pricesConfirmed === true;

    document.dispatchEvent(new CustomEvent("shop:loaded", { detail: data }));
  } catch (error) {
    priceList.replaceChildren(
      el("p", { class: "error" }, "The price list could not load. Check your connection and refresh, or ask for prices at the shop.")
    );
    console.error("Could not load prices", error);
  }
}

start();
