import assert from "node:assert/strict";
import test from "node:test";
import { getEditorialScrollState } from "./editorial-scroll.ts";

test("clamps progress outside the scene", () => {
  assert.equal(getEditorialScrollState(-1).progress, 0);
  assert.equal(getEditorialScrollState(2).progress, 1);
});

test("keeps the opening composition before pin growth", () => {
  const state = getEditorialScrollState(0.18);
  assert.equal(state.mediaProgress, 0);
  assert.equal(state.overlayProgress, 0);
  assert.equal(state.copyOpacity, 1);
});

test("finishes media growth before revealing overlay", () => {
  const state = getEditorialScrollState(0.68);
  assert.equal(state.mediaProgress, 1);
  assert.equal(state.overlayProgress, 0);
  assert.equal(state.copyOpacity, 0);
});

test("reveals the approved overlay by the hold phase", () => {
  const state = getEditorialScrollState(0.82);
  assert.equal(state.mediaProgress, 1);
  assert.equal(state.overlayProgress, 1);
});
