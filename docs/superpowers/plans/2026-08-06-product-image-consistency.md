# Product Image Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Устранить чужие и пустые изображения товаров, чтобы каждый demo-товар имел собственный подписанный ассет во всех карточках и на странице товара.

**Architecture:** Вынести соответствие `product id → собственные изображения` в явный manifest и использовать его при построении `demoProducts`. Убрать fallback по категории. Галерея товара будет получать только manifest-ассеты текущего товара; при отсутствии дополнительных кадров будет использоваться его собственный основной packshot, а не чужая упаковка или пустой lifestyle-рендер.

**Tech Stack:** Next.js 16, React 19, TypeScript, Next Image, Node test runner, локальные PNG-ассеты в `public/images/kanso/products`.

## Global Constraints

- Не изменять расположение карточек, товарные данные, цены, тексты, кнопки и логику корзины/избранного.
- Не использовать `imageByCategory` как fallback для demo-товаров.
- Каждый ассет должен быть связан с конкретным товаром и содержать визуально читаемую упаковку/маркировку.
- Сохранить clean girl арт-дирекцию: натуральные материалы, мягкий дневной свет, молочно-бежевые и прохладно-голубые оттенки.
- Не коммитить и не пушить изменения.

### Task 1: Зафиксировать контракт ассетов и красный тест

**Files:**
- Create: `src/data/product-image-manifest.ts`
- Create: `tests/product-image-consistency.test.mjs`
- Modify: `src/data/demo-products.ts`

**Interfaces:**
- `productImageManifest: Record<string, { primary: string; secondary?: string; gallery?: readonly string[] }>` — единый список путей для всех demo-товаров.
- `demoProducts` продолжает экспортировать `DemoProduct[]`; компоненты не меняют публичный API.

- [ ] **Step 1: Write the failing test**

Проверить, что manifest содержит все 20 id из `demoProducts`, что каждый путь относится к своему id-мэппингу, а исходник больше не содержит `imageByCategory` и выражение `imageByCategory[category]`.

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = await readFile(new URL("../src/data/demo-products.ts", import.meta.url), "utf8");
const manifest = await readFile(new URL("../src/data/product-image-manifest.ts", import.meta.url), "utf8");

test("every demo product uses an explicit image manifest", () => {
  for (const id of ["new-01", "new-02", "new-03", "new-04", "best-01", "best-02", "best-03", "best-04", "best-05", "face-01", "face-02", "hair-01", "hair-02", "body-01", "wellness-01", "wellness-02", "wellness-03", "wellness-04", "wellness-05", "wellness-06"]) {
    assert.match(manifest, new RegExp(`\\\"${id}\\\"`));
  }
  assert.doesNotMatch(data, /imageByCategory/);
});

test("the SPF product does not use the unlabeled lifestyle render", () => {
  assert.doesNotMatch(manifest, /new-02[\\s\\S]*direia-uv\\.png/);
});
```

- [ ] **Step 2: Run the failing test**

Run: `node --test tests/product-image-consistency.test.mjs`

Expected: FAIL because the manifest does not exist yet and `demo-products.ts` still contains the category fallback.

- [ ] **Step 3: Add the manifest and remove the fallback**

Declare explicit entries for all 20 ids. Keep existing correct assets for `new-01`, `new-03`, `new-04`, `best-01`–`best-05` and `face-02`; use new generated paths for the ten currently missing products and a labeled secondary asset for `new-02`. Build each product with `productImageManifest[id]` and use its `primary` as the safe default for `secondary`.

- [ ] **Step 4: Run the contract test**

Run: `node --test tests/product-image-consistency.test.mjs`

Expected: PASS for manifest coverage and for removal of category substitution. Missing generated files are checked in Task 2.

### Task 2: Create the missing labeled product assets

**Files:**
- Create: `public/images/kanso/products/face-01.png`
- Create: `public/images/kanso/products/hair-01.png`
- Create: `public/images/kanso/products/hair-02.png`
- Create: `public/images/kanso/products/body-01.png`
- Create: `public/images/kanso/products/wellness-01.png`
- Create: `public/images/kanso/products/wellness-02.png`
- Create: `public/images/kanso/products/wellness-03.png`
- Create: `public/images/kanso/products/wellness-04.png`
- Create: `public/images/kanso/products/wellness-05.png`
- Create: `public/images/kanso/products/wellness-06.png`
- Create: `public/images/kanso/products/direia-uv-labeled.png`

**Interfaces:**
- Each PNG is a product-specific packshot, at least 1000×1000, with enough contrast for the label to remain visible in a catalog card.

- [ ] **Step 1: Generate the ten missing product packshots**

Use the image-generation tool with one consistent prompt family. Preserve the known brand and product name from `src/data/demo-products.ts`; do not invent claims, ingredients, prices, ratings, or medical effects. Use clean minimal packaging, readable brand/product text, a pale blue or warm ivory background, soft daylight, and no extra products.

- [ ] **Step 2: Generate the labeled SPF secondary frame**

Create `direia-uv-labeled.png` as a quiet editorial product shot of the same Direia tube, with the visible `STEM PROTECT UV CREAM`, `SPF50+`, and `direia` marking. Do not use an empty tube or add another product.

- [ ] **Step 3: Inspect each generated asset**

Open every created PNG and reject any frame with an empty package, unreadable/malformed product name, duplicate unrelated package, cropped product, or multiple products. Regenerate only the failed asset.

- [ ] **Step 4: Verify dimensions and paths**

Run: `file public/images/kanso/products/face-01.png public/images/kanso/products/hair-01.png public/images/kanso/products/hair-02.png public/images/kanso/products/body-01.png public/images/kanso/products/wellness-01.png public/images/kanso/products/wellness-02.png public/images/kanso/products/wellness-03.png public/images/kanso/products/wellness-04.png public/images/kanso/products/wellness-05.png public/images/kanso/products/wellness-06.png public/images/kanso/products/direia-uv-labeled.png`

Expected: all files exist as readable PNG images with consistent dimensions.

### Task 3: Wire the manifest into every product surface

**Files:**
- Modify: `src/data/demo-products.ts`
- Modify: `src/components/product-detail.tsx`
- Test: `tests/product-image-consistency.test.mjs`

**Interfaces:**
- `DemoProduct.image` is the explicit primary asset.
- `DemoProduct.hoverImage` is the explicit secondary asset or the same product’s primary asset.
- `DemoProduct.galleryImages` contains only paths from the same manifest entry.

- [ ] **Step 1: Add manifest consistency assertions**

Extend the test to parse the manifest source and assert that `new-02` references `direia-uv-labeled.png`, that no manifest value contains `imageByCategory`, and that no `galleryImages` entry for a product points to a different product stem.

- [ ] **Step 2: Build product records from the manifest**

Remove `imageByProduct`, `cutoutByProduct`, and `imageByCategory` as competing sources. Each seed id must resolve through one explicit manifest entry; fail loudly during module creation if an id is missing rather than silently substituting an image.

- [ ] **Step 3: Make the gallery fallback self-contained**

Keep the current gallery behavior, but build its fallback from `product.image` and `product.hoverImage` only. Ensure `galleryImages` is deduplicated and never includes the old unlabeled `direia-uv.png`.

- [ ] **Step 4: Run focused checks**

Run: `node --test tests/product-image-consistency.test.mjs tests/cart-product-links.test.mjs tests/favorites-active-heart.test.mjs`

Expected: PASS; all product links and wishlist behavior remain unchanged.

### Task 4: Audit rendered surfaces

**Files:**
- Test: `tests/product-image-consistency.test.mjs`
- Verify visually: `/`, `/catalog`, `/favorites`, `/cart`, `/product/new-01` through `/product/new-04`, `/product/face-01`, `/product/hair-01`, `/product/body-01`, `/product/wellness-01`.

- [ ] **Step 1: Render the local app**

Run the existing local dev server on `http://localhost:3003` and reload the listed routes.

- [ ] **Step 2: Check the main and catalog cards**

Confirm that every visible product card shows a product-specific package, no empty jars/tubes, and no category-level duplicate used for a different name.

- [ ] **Step 3: Check product galleries**

Open the main image and each thumbnail on representative products, especially SPF50+, face-01, hair-01 and wellness-01. Confirm each frame belongs to the current product and has visible labeling.

- [ ] **Step 4: Check secondary surfaces**

Confirm that favorites and cart preserve the same product image mapping and that clicking any product image/name still opens the correct `/product/[id]` route.

### Task 5: Final automated verification

**Files:**
- No new source files.

- [ ] **Step 1: Run the full verification suite**

Run: `node --test tests/*.test.mjs && npm run typecheck && npm run build && git diff --check`

Expected: all tests pass, the production build completes, TypeScript reports no errors, and the diff has no whitespace errors.

- [ ] **Step 2: Confirm scope**

Use `git diff --stat` and `git diff -- src/data/demo-products.ts src/data/product-image-manifest.ts src/components/product-detail.tsx tests/product-image-consistency.test.mjs` to confirm only product-image data, generated product assets, gallery fallback safety, and tests changed. Do not commit or push.
