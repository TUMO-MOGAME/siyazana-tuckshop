import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkPriceFile, readPriceFile, slug } from "../js/data.js";

const raw = JSON.parse(readFileSync(new URL("../data/products.json", import.meta.url), "utf8"));

test("data/products.json has no mistakes", () => {
  const problems = checkPriceFile(raw);
  assert.deepEqual(problems, [], `Fix these in data/products.json:\n- ${problems.join("\n- ")}`);
});

test("products are grouped by category, in the order they appear", () => {
  const { categories } = readPriceFile(raw);
  assert.deepEqual(categories.map((c) => c.name), ["Fast Food", "Bread and Milk", "Groceries", "Drinks"]);
  assert.deepEqual(categories.map((c) => c.id), ["fast-food", "bread-and-milk", "groceries", "drinks"]);
  const total = categories.reduce((n, c) => n + c.products.length, 0);
  assert.equal(total, raw.products.length);
});

test("opening hours are read into days, open and close", () => {
  const { shop } = readPriceFile(raw);
  assert.deepEqual(shop.hours[0], { days: "Monday to Friday", open: "08:00", close: "20:00" });
  assert.ok(shop.hours.some((h) => h.days === "Public holidays"));
});

test("common mistakes are explained in plain words", () => {
  const bad = {
    store: "Shop", whatsapp: "082 123 4567",
    hours: { weekdays: "8am to 8pm" },
    products: [
      { name: "Bread", category: "Bread", price: "R18" },
      { name: "Bread", category: "Bread", price: 18 },
      { name: "Milk", price: 14 },
    ],
  };
  const problems = checkPriceFile(bad).join("\n");
  assert.match(problems, /hours "weekdays" should look like "08:00-20:00"/);
  assert.match(problems, /Product 1 \(Bread\) needs a "price" that is a number/);
  assert.match(problems, /Product 2 \(Bread\) appears twice/);
  assert.match(problems, /Product 3 \(Milk\) has no "category"/);
  assert.throws(() => readPriceFile(bad), /Price file problems/);
});

test("slug makes safe link names", () => {
  assert.equal(slug("Bread and Milk"), "bread-and-milk");
  assert.equal(slug("  Fast Food! "), "fast-food");
});
