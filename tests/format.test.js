import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatRand } from "../js/format.js";

test("whole rands have no cents", () => {
  assert.equal(formatRand(18), "R18");
  assert.equal(formatRand(0), "R0");
});

test("amounts with cents show two decimals", () => {
  assert.equal(formatRand(7.5), "R7.50");
});

test("every product in the price file has a usable price", () => {
  const data = JSON.parse(readFileSync(new URL("../data/products.json", import.meta.url), "utf8"));
  const ids = new Set();
  for (const category of data.categories) {
    assert.ok(category.id && !ids.has(category.id), `category id missing or repeated: ${category.id}`);
    ids.add(category.id);
    for (const product of category.products) {
      const prices = product.options ? product.options.map((o) => o.price) : [product.price];
      for (const price of prices) {
        assert.ok(Number.isFinite(price) && price > 0, `${product.name} has a bad price: ${price}`);
      }
    }
  }
  assert.ok(Array.isArray(data.shop.hours) && data.shop.hours.length > 0, "opening hours missing");
});
