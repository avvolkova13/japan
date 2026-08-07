import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("checkout submit has an explicit primary button treatment", () => {
  const match = css.match(/\.checkout-submit\s*\{([^}]*)\}/s);

  assert.ok(match, "checkout submit selector should exist");
  assert.match(match[1], /background:\s*var\(--graphite\)/);
  assert.match(match[1], /color:\s*var\(--white\)/);
  assert.match(match[1], /display:\s*inline-flex/);
  assert.match(match[1], /justify-content:\s*center/);
});

test("payment section keeps its divider above the heading", () => {
  const divider = css.match(/\.checkout-form fieldset::before\s*\{([^}]*)\}/s);

  assert.match(css, /\.checkout-form fieldset \{ margin: 0; border: 0; padding: 0; \}/);
  assert.ok(divider, "checkout payment divider should be explicit");
  assert.match(divider[1], /border-top:\s*1px solid var\(--graphite\)/);
});

test("checkout intro copy aligns with the order summary column", () => {
  assert.match(css, /\.checkout-intro > p \{ max-width: none; width: min\(27rem, 100%\); margin-left: auto;/);
});
