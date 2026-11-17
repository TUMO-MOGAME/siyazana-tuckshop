// Money formatting shared by the price list and the order.

/** 18 -> "R18", 7.5 -> "R7.50" */
export function formatRand(amount) {
  const value = Number(amount);
  return Number.isInteger(value) ? `R${value}` : `R${value.toFixed(2)}`;
}
