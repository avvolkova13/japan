import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("uses Literature for headings and Onest for descriptive text", () => {
  assert.match(styles, /@import url\("https:\/\/fonts\.googleapis\.com\/css2\?family=Onest/);
  assert.match(styles, /@import "@fontsource-variable\/literata\/wght\.css"/);
  assert.match(styles, /--font-display:\s*Literata/);
  assert.match(styles, /--font-body:\s*Onest/);
  assert.match(styles, /body\s*\{[\s\S]*font-family:\s*var\(--font-body\)/);
  assert.match(styles, /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[\s\S]*font-family:\s*var\(--font-display\)/);
  assert.match(styles, /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[\s\S]*padding-bottom:\s*0\.12em/);
  assert.match(styles, /\.brand-mark\s*\{[^}]*font-family:\s*var\(--font-display\)/);
  assert.match(styles, /\.brand-mark\s*\{[^}]*letter-spacing:\s*0\.08em/);
  assert.match(styles, /\.category-card h3\s*\{[^}]*font-size:\s*clamp\(1\.15rem,\s*1\.4vw,\s*1\.45rem\)/);
});
