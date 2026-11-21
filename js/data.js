// Reads data/products.json (the format the team edits: one line per product) and turns it into
// what the page needs. checkPriceFile() lists every mistake so `npm test` can explain it.

const HOUR_LABELS = {
  weekdays: "Monday to Friday",
  weekends: "Saturday and Sunday",
  holidays: "Public holidays",
};

export function slug(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Returns a list of problems with the price file. An empty list means it is fine. */
export function checkPriceFile(raw) {
  const problems = [];
  if (!raw || typeof raw !== "object") return ["The file is not a JSON object."];
  if (!raw.store) problems.push('"store" (the shop name) is missing.');
  if (!raw.whatsapp) problems.push('"whatsapp" is missing.');
  if (!raw.hours || typeof raw.hours !== "object") {
    problems.push('"hours" is missing.');
  } else {
    for (const [key, value] of Object.entries(raw.hours)) {
      if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(value)) problems.push(`hours "${key}" should look like "08:00-20:00", not "${value}".`);
    }
  }
  if (!Array.isArray(raw.products) || raw.products.length === 0) {
    problems.push('"products" is missing or empty.');
    return problems;
  }
  const names = new Set();
  raw.products.forEach((p, i) => {
    const where = `Product ${i + 1}${p && p.name ? ` (${p.name})` : ""}`;
    if (!p || !p.name) problems.push(`${where} has no "name".`);
    if (!p || !p.category) problems.push(`${where} has no "category".`);
    if (!p || !Number.isFinite(p.price) || p.price <= 0) problems.push(`${where} needs a "price" that is a number above 0, without "R".`);
    if (p && p.name && names.has(p.name)) problems.push(`${where} appears twice.`);
    if (p && p.name) names.add(p.name);
  });
  return problems;
}

/** Turns the price file into { shop, categories } for the page. Categories keep the order they first appear in. */
export function readPriceFile(raw) {
  const problems = checkPriceFile(raw);
  if (problems.length) throw new Error(`Price file problems: ${problems.join(" ")}`);

  const hours = Object.entries(raw.hours).map(([key, value]) => {
    const [open, close] = value.split("-");
    return { days: HOUR_LABELS[key] || key, open, close };
  });

  const categories = [];
  const byName = new Map();
  for (const product of raw.products) {
    if (!byName.has(product.category)) {
      const category = { id: slug(product.category), name: product.category, products: [] };
      byName.set(product.category, category);
      categories.push(category);
    }
    byName.get(product.category).products.push({ name: product.name, price: product.price });
  }

  return {
    shop: {
      name: raw.store,
      whatsapp: raw.whatsapp,
      pricesConfirmed: raw.pricesConfirmed === true,
      hours,
      payment: raw.payment || "",
      delivery: raw.delivery || "",
    },
    categories,
  };
}
