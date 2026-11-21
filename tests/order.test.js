import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  orderableItems, orderLines, orderTotal, itemCount, changeQuantity,
  orderMessage, whatsappNumber, whatsappLink, MAX_QUANTITY,
} from "../js/order.js";
import { readPriceFile } from "../js/data.js";

const data = readPriceFile(JSON.parse(readFileSync(new URL("../data/products.json", import.meta.url), "utf8")));
const items = orderableItems(data.categories);
const find = (name) => items.find((i) => i.name === name);

test("every product becomes an orderable item with a unique key", () => {
  assert.ok(find("Kota - Medium"));
  assert.equal(find("Kota - Medium").price, 25);
  assert.equal(new Set(items.map((i) => i.key)).size, items.length);
});

test("quantities add up, never go below 0 or above the maximum", () => {
  const basket = new Map();
  const kota = find("Kota - Medium").key;
  changeQuantity(basket, kota, 1);
  changeQuantity(basket, kota, 1);
  assert.equal(basket.get(kota), 2);
  changeQuantity(basket, kota, -5);
  assert.equal(basket.has(kota), false);
  for (let i = 0; i < MAX_QUANTITY + 5; i++) changeQuantity(basket, kota, 1);
  assert.equal(basket.get(kota), MAX_QUANTITY);
});

test("order lines, item count and total are right", () => {
  const basket = new Map([[find("Kota - Medium").key, 2], [find("Coke 2L").key, 1], [find("Vetkoek").key, 3]]);
  const lines = orderLines(items, basket);
  assert.deepEqual(lines.map((l) => l.name), ["Kota - Medium", "Vetkoek", "Coke 2L"]);
  assert.equal(itemCount(lines), 6);
  assert.equal(orderTotal(lines), 2 * 25 + 3 * 5 + 30);
});

test("the WhatsApp message lists every item, the total, name and note", () => {
  const basket = new Map([[find("Kota - Medium").key, 2], [find("Coke 2L").key, 1]]);
  const message = orderMessage("Siyazana Tuckshop", orderLines(items, basket), { name: " Thabo ", note: "Collect at 17:00" });
  assert.equal(message, [
    "Hi Siyazana Tuckshop, I would like to order:",
    "",
    "2 x Kota - Medium = R50",
    "1 x Coke 2L = R30",
    "",
    "Total: R80",
    "Name: Thabo",
    "Note: Collect at 17:00",
    "",
    "Please confirm stock and when I can collect.",
  ].join("\n"));
});

test("name and note are left out when empty", () => {
  const basket = new Map([[find("Vetkoek").key, 1]]);
  const message = orderMessage("Siyazana Tuckshop", orderLines(items, basket));
  assert.ok(!message.includes("Name:"));
  assert.ok(!message.includes("Note:"));
});

test("South African numbers are turned into WhatsApp format", () => {
  assert.equal(whatsappNumber("082 123 4567"), "27821234567");
  assert.equal(whatsappNumber("+27 82 123 4567"), "27821234567");
  assert.equal(whatsappNumber("TO CONFIRM"), null);
  assert.equal(whatsappNumber("12345"), null);
});

test("the WhatsApp link has the number when known, and asks for a contact when not", () => {
  assert.equal(whatsappLink("082 123 4567", "2 x Kota"), "https://wa.me/27821234567?text=2%20x%20Kota");
  assert.equal(whatsappLink("TO CONFIRM", "Total: R80"), "https://wa.me/?text=Total%3A%20R80");
});

test("the shop's confirmed WhatsApp number is in a usable format", () => {
  assert.equal(whatsappNumber(data.shop.whatsapp), "27672947717");
});

test("the old sizes format (options) still works if someone uses it", () => {
  const old = orderableItems([{ id: "x", name: "X", products: [{ name: "Kota", options: [{ label: "R18", price: 18 }] }] }]);
  assert.equal(old[0].name, "Kota (R18)");
});
