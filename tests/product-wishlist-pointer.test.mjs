import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/components/product-detail.tsx", import.meta.url), "utf8");

test("product wishlist button does not start the gallery drag gesture", () => {
  assert.match(
    source,
    /className={`product-wishlist-button[\s\S]*?onPointerDown=\{\(event\) => event\.stopPropagation\(\)\}[\s\S]*?onClick=\{toggleWishlist\}/,
  );
});
