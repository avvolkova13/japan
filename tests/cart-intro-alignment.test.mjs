import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("cart intro description shares the summary column's left edge", () => {
  assert.match(
    styles,
    /\.cart-intro\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(18rem, 24rem\);[^}]*gap:\s*clamp\(40px, 8vw, 120px\);/s,
  );
  assert.match(styles, /\.cart-intro > p\s*\{[^}]*max-width:\s*none;/s);
});
