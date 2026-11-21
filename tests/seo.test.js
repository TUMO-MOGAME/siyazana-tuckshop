import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { readPriceFile } from "../js/data.js";
import { whatsappNumber } from "../js/order.js";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = read("index.html");
const { shop } = readPriceFile(JSON.parse(read("data/products.json")));
const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

test("shop details for Google match data/products.json", () => {
  assert.equal(ld.telephone.replace("+", ""), whatsappNumber(shop.whatsapp), "phone in index.html differs from products.json");
  const weekday = shop.hours.find((h) => h.days === "Monday to Friday");
  const weekend = shop.hours.find((h) => h.days === "Saturday and Sunday");
  const [ldWeek, ldWeekend] = ld.openingHoursSpecification;
  assert.deepEqual([ldWeek.opens, ldWeek.closes], [weekday.open, weekday.close], "weekday hours in index.html differ from products.json");
  assert.deepEqual([ldWeekend.opens, ldWeekend.closes], [weekend.open, weekend.close], "weekend hours in index.html differ from products.json");
});

test("pages and files the site links to exist", () => {
  for (const file of ["privacy.html", "404.html", "sitemap.xml", "assets/images/share.png", "assets/images/icon.svg"]) {
    assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${file} is missing`);
  }
});
