import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../src/components/home-page.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("footer does not advertise unavailable social networks", () => {
  assert.doesNotMatch(page, /Instagram|Pinterest|Мы в сети/);
  assert.match(page, /<div className="footer-column"><p className="micro-label">О KANSO<\/p>/);
  assert.doesNotMatch(styles, /\.footer-top \{ grid-template-columns: 1\.5fr repeat\(4, 1fr\); \}/);
});
