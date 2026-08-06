import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const data = await readFile(new URL("../src/data/demo-products.ts", import.meta.url), "utf8");
const manifest = await readFile(new URL("../src/data/product-image-manifest.ts", import.meta.url), "utf8");

const productImageFiles = [
  "face-01.png",
  "face-02.png",
  "hair-01.png",
  "hair-02.png",
  "hair-02-cutout.png",
  "hair-02-isolated.png",
  "body-01.png",
  "body-01-cutout.png",
  "body-01-isolated.png",
  "wellness-01.png",
  "wellness-01-cutout.png",
  "wellness-01-isolated.png",
  "wellness-02.png",
  "wellness-02-cutout.png",
  "wellness-02-isolated.png",
  "wellness-03.png",
  "wellness-03-cutout.png",
  "wellness-03-isolated.png",
  "wellness-04.png",
  "wellness-04-cutout.png",
  "wellness-04-isolated.png",
  "wellness-05.png",
  "wellness-05-cutout.png",
  "wellness-05-isolated.png",
  "wellness-06.png",
  "wellness-06-cutout.png",
  "wellness-06-isolated.png",
  "direia-uv-labeled.png",
  "amaranth-dr-soie-labeled.png",
  "enzym-cerad-labeled.jpg",
  "spa-treatment-exo-labeled.jpg",
  "face-01-cutout.png",
  "face-02-cutout.png",
  "hair-01-cutout.png",
];

test("every demo product uses an explicit image manifest", () => {
  for (const id of ["new-01", "new-02", "new-03", "new-04", "best-01", "best-02", "best-03", "best-04", "best-05", "face-01", "face-02", "hair-01", "hair-02", "body-01", "wellness-01", "wellness-02", "wellness-03", "wellness-04", "wellness-05", "wellness-06"]) {
    assert.match(manifest, new RegExp(`\\\"${id}\\\"`));
  }
  assert.doesNotMatch(data, /imageByCategory/);
});

test("the SPF product does not use the unlabeled lifestyle render", () => {
  assert.doesNotMatch(manifest, /new-02[\\s\\S]*direia-uv\\.png/);
});

test("the Amaranth cushion uses the verified Dr.Soie-labeled asset", () => {
  assert.match(manifest, /"new-01"[\s\S]*amaranth-dr-soie-labeled\.png/);
  assert.doesNotMatch(manifest, /"new-01"[\s\S]*amaranth-dr-soie-cutout\.png/);
});

test("the Enzy Cerad lotion uses a cutout first and a labeled hover image", () => {
  assert.match(manifest, /"best-02"[\s\S]*primary: ".*enzym-cutout\.png"[\s\S]*secondary: ".*enzym-cerad-labeled\.jpg"/);
});

test("the EXO Moist serum uses a cutout first and an official labeled hover image", () => {
  assert.match(manifest, /"best-03"[\s\S]*primary: ".*spa-treatment-exo-cutout\.png"[\s\S]*secondary: ".*spa-treatment-exo-labeled\.jpg"/);
});

test("every generated product asset exists in the public directory", async () => {
  await Promise.all(
    productImageFiles.map((filename) =>
      access(new URL(`../public/images/kanso/products/${filename}`, import.meta.url)),
    ),
  );
});
