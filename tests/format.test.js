import { test } from "node:test";
import assert from "node:assert/strict";
import { formatRand } from "../js/format.js";

test("whole rands have no cents", () => {
  assert.equal(formatRand(18), "R18");
  assert.equal(formatRand(0), "R0");
});

test("amounts with cents show two decimals", () => {
  assert.equal(formatRand(7.5), "R7.50");
});
