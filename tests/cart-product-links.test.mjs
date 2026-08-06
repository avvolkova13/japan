import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/app/cart/page.tsx", import.meta.url), "utf8");

test("cart product image links to its product page", () => {
  assert.match(
    source,
    /<Link className="cart-item-image" href={`\/product\/\$\{product\.id\}`}[^>]*>\s*<Image[\s\S]*?<\/Link>/,
  );
});

test("cart product name links to its product page", () => {
  assert.match(
    source,
    /<h2>\s*<Link href={`\/product\/\$\{product\.id\}`}>\{product\.name\}<\/Link>\s*<\/h2>/,
  );
});
