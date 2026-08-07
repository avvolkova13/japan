import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../src/app/favorites/page.tsx", import.meta.url), "utf8");

test("favorite cards render their heart as pressed", () => {
  assert.match(
    page,
    /<button className="wishlist-button is-active" type="button" onClick=\{\(\) => remove\(product\.id\)\} aria-label=\{`Удалить \$\{product\.name\} из избранного`\} aria-pressed=\{true\}>/,
  );
});
