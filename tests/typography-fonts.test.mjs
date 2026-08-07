import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("uses Literature for headings and Onest for descriptive text", () => {
  assert.match(styles, /@import url\("https:\/\/fonts\.googleapis\.com\/css2\?family=Onest/);
  assert.match(styles, /--font-display:\s*Literature/);
  assert.match(styles, /--font-body:\s*Onest/);
  assert.match(styles, /body\s*\{[\s\S]*font-family:\s*var\(--font-body\)/);
  assert.match(styles, /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[\s\S]*font-family:\s*var\(--font-display\)/);
  assert.doesNotMatch(styles, /Georgia|Times New Roman|Helvetica|Arial|serif|sans-serif/);
});
