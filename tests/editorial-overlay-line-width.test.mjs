import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("editorial overlay line reaches the full text width", () => {
  assert.match(styles, /\.editorial-scroll-line\s*\{[^}]*transform:\s*scaleX\(1\);/s);
});
