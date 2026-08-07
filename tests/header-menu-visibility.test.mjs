import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("desktop shared header overrides keep the menu trigger hidden", () => {
  const sharedStart = css.indexOf("/* Final shared overrides");
  const responsiveStart = css.indexOf("@media (max-width: 1024px)", sharedStart);
  const sharedOverrides = css.slice(sharedStart, responsiveStart);

  assert.match(sharedOverrides, /\.menu-trigger \{ display: none; \}/);
});
