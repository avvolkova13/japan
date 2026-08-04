# Responsive Internal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Исправить адаптивное поведение всех внутренних страниц KANSO на ширинах 320–1024 px без изменений десктопной компоновки от 1025 px.

**Architecture:** Работа выполняется evidence-first по группам маршрутов. Для каждой группы сначала сохраняется RED-матрица DOM-геометрии и визуальных дефектов, затем в `src/app/globals.css` добавляются минимальные локальные правила до 1024 px, после чего повторяется та же матрица. JSX меняется только при доказанной семантической или accessibility-проблеме, которую нельзя исправить CSS.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS media queries, in-app Browser geometry checks, ESLint, `tsc`, Next production build.

## Global Constraints

- Не менять стили и компоновку от 1025 px.
- Не менять утверждённую структуру главной страницы.
- Не устанавливать зависимости.
- Не придумывать бизнес-, юридические или коммерческие данные.
- Сохранять существующую визуальную систему KANSO.
- Контрольные ширины: 320, 390, 768, 1024 и регрессионная 1440 px.
- На ширинах до 1024 px должны отсутствовать horizontal overflow, обрезанный текст, пересечения и недоступные элементы управления.

---

### Task 1: Catalog and product RED/GREEN cycle

**Files:**
- Modify: `src/app/globals.css:751-1118, 2695-3055`
- Modify only if CSS cannot preserve semantics: `src/app/catalog/page.tsx`
- Modify only if CSS cannot preserve semantics: `src/components/catalog-toolbar.tsx`
- Modify only if CSS cannot preserve semantics: `src/components/catalog-product-card.tsx`
- Modify only if CSS cannot preserve semantics: `src/components/product-detail.tsx`
- Test: `/catalog`, `/catalog?category=skin-care`, `/product/new-01`

**Interfaces:**
- Consumes: existing `.catalog-*`, `.product-*`, `.button`, `.quantity-control` classes and existing product/cart/wishlist handlers.
- Produces: catalog and product layouts that fit 320–1024 px while preserving existing DOM, interactions and desktop styles.

- [ ] **Step 1: Capture the failing geometry matrix**

Run the local app and inspect the three test URLs at 320, 390, 768 and 1024 px. For each page evaluate:

```js
({
  viewport: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  clippedText: [...document.querySelectorAll("h1,h2,h3,p,a,button,label")]
    .filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1)
    .map((node) => ({ selector: node.className || node.tagName, text: node.textContent?.trim().slice(0, 80) })),
  outside: [...document.querySelectorAll("main *")]
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
    })
    .map((node) => node.className || node.tagName),
})
```

Expected RED: at least one route records the concrete existing defect or visual failure that justifies a change. Save route, width, selector and measured geometry in the task report. If all checks and screenshots pass, make no production change for that route.

- [ ] **Step 2: Trace each defect to its active rule**

For every RED selector, compare its computed `display`, `grid-template-columns`, `width`, `min-width`, `position`, `overflow`, `font-size` and `line-height` with the closest working width. State one root-cause hypothesis per defect before editing.

- [ ] **Step 3: Add minimal responsive rules**

In the existing responsive section of `src/app/globals.css`, constrain changes to these boundaries:

```css
@media (max-width: 1024px) {
  /* tablet catalog/product corrections proven by RED */
}

@media (max-width: 767px) {
  /* mobile catalog/product corrections proven by RED */
}
```

Prefer collapsing grids, allowing controlled horizontal scrolling for thumbnail/tag rails, and removing sticky positioning below 1025 px. Do not add selectors that are not tied to a recorded RED failure.

- [ ] **Step 4: Verify GREEN and interactions**

Repeat Step 1 at all four widths. Open catalog filters; activate wishlist and quick-add; swipe or use keyboard arrows in the product gallery; change quantity; verify every control stays inside the viewport and has a visible focus state.

Expected: `overflow: false`, no unexpected `outside` selectors, and no clipping except intentionally line-clamped product copy documented in CSS.

- [ ] **Step 5: Verify desktop isolation**

At 1440 px compare catalog and product geometry with the pre-change screenshot. Confirm every new production selector is nested under `max-width: 1024px` or `max-width: 767px`.

- [ ] **Step 6: Commit the task**

```bash
git add src/app/globals.css src/app/catalog/page.tsx src/components/catalog-toolbar.tsx src/components/catalog-product-card.tsx src/components/product-detail.tsx
git commit -m "fix: refine catalog and product responsive layouts"
```

Stage only files actually changed.

---

### Task 2: Commerce and account RED/GREEN cycle

**Files:**
- Modify: `src/app/globals.css:1310-1687, 2560-2694`
- Modify only if CSS cannot preserve semantics: `src/app/favorites/page.tsx`
- Modify only if CSS cannot preserve semantics: `src/app/cart/page.tsx`
- Modify only if CSS cannot preserve semantics: `src/app/checkout/page.tsx`
- Modify only if CSS cannot preserve semantics: `src/app/account/page.tsx`
- Test: `/favorites`, `/wishlist`, `/cart`, `/checkout`, `/account`

**Interfaces:**
- Consumes: browser storage-backed demo wishlist, cart, account and checkout states.
- Produces: readable empty and populated commerce/account layouts with intact controls and form semantics at 320–1024 px.

- [ ] **Step 1: Prepare both empty and populated states**

Use existing UI controls to create at least two wishlist items and two cart items. Test account/checkout logged-out states first. Create a demo account only through the existing form, then test dashboard and populated checkout; do not write or inspect browser storage directly.

- [ ] **Step 2: Capture RED geometry and visual evidence**

Run the Step 1 geometry script from Task 1 at 320, 390, 768 and 1024 px for every route and state. Additionally record:

```js
({
  inputs: [...document.querySelectorAll("input,select,textarea")].map((node) => ({
    name: node.getAttribute("name"),
    width: node.getBoundingClientRect().width,
    right: node.getBoundingClientRect().right,
  })),
  controlsUnder44: [...document.querySelectorAll("button,a,input,select")]
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.height < 44;
    })
    .map((node) => node.getAttribute("aria-label") || node.textContent?.trim().slice(0, 60)),
})
```

Expected RED: each proposed edit must be tied to a measured overflow, collision, unreadable density, visual defect or undersized primary control.

- [ ] **Step 3: Trace root causes**

Inspect the active grid columns, sticky positions, fixed minimum widths, white-space rules and form row layouts. Compare empty versus populated state before deciding whether the cause is shared CSS or state-specific markup.

- [ ] **Step 4: Implement minimal responsive corrections**

Add only proven rules under existing `max-width: 1024px` and `max-width: 767px` media queries. Expected patterns are single-column checkout/cart layouts, non-sticky summaries, stacked cart metadata, wrapped account navigation and one-column narrow form rows. Preserve all labels, headings, buttons and storage behavior.

- [ ] **Step 5: Verify GREEN and keyboard flow**

Repeat geometry checks for every route/state. Tab through each form in DOM order, toggle password visibility, change cart quantities, remove an item, and submit only with demo values. Confirm status/error messages remain visible and do not move controls outside the viewport.

- [ ] **Step 6: Verify desktop isolation and commit**

Check all five routes at 1440 px, then run:

```bash
git add src/app/globals.css src/app/favorites/page.tsx src/app/cart/page.tsx src/app/checkout/page.tsx src/app/account/page.tsx
git commit -m "fix: refine commerce and account responsive layouts"
```

Stage only files actually changed.

---

### Task 3: Journal and ritual RED/GREEN cycle

**Files:**
- Modify: `src/app/globals.css:1120-1310, 2346-2445, 2695-3055`
- Modify only if CSS cannot preserve semantics: `src/app/journal/page.tsx`
- Modify only if CSS cannot preserve semantics: `src/app/journal/[slug]/page.tsx`
- Modify only if CSS cannot preserve semantics: `src/app/journal/japanese-approach/page.tsx`
- Modify only if CSS cannot preserve semantics: `src/app/ritual/page.tsx`
- Test: `/journal`, `/journal/sun-care-textures`, `/journal/quiet-morning-rituals`, `/journal/japanese-approach`, `/ritual`

**Interfaces:**
- Consumes: journal story data and the existing client-side ritual questionnaire.
- Produces: readable editorial pages and complete questionnaire/result layouts at 320–1024 px.

- [ ] **Step 1: Capture RED evidence**

Run the Task 1 geometry script at 320, 390, 768 and 1024 px on every route. Inspect the top, middle and bottom of long articles. On `/ritual`, complete every question and inspect both question and result states.

Record heading bounding boxes separately to detect clipped descenders:

```js
[...document.querySelectorAll("h1,h2,h3")].map((node) => {
  const rect = node.getBoundingClientRect();
  return {
    text: node.textContent?.trim(),
    height: rect.height,
    lineHeight: getComputedStyle(node).lineHeight,
    overflow: getComputedStyle(node).overflow,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
  };
})
```

- [ ] **Step 2: Trace root causes and implement minimal CSS**

For each failure compare grid columns, media aspect ratios, heading line-height/padding, max-width and option/action layout with a working width. Add only evidence-backed rules under `max-width: 1024px` or `max-width: 767px`. Do not shorten article or questionnaire text.

- [ ] **Step 3: Verify GREEN and interactions**

Repeat all geometry checks. Complete the ritual once more using only keyboard controls. Verify progress indicators, selected answers, result cards, article links and return links remain visible and do not overlap.

- [ ] **Step 4: Verify desktop isolation and commit**

Check all journal routes and `/ritual` at 1440 px, then run:

```bash
git add src/app/globals.css src/app/journal/page.tsx src/app/journal/[slug]/page.tsx src/app/journal/japanese-approach/page.tsx src/app/ritual/page.tsx
git commit -m "fix: refine journal and ritual responsive layouts"
```

Stage only files actually changed.

---

### Task 4: Shared layout, accessibility and full regression matrix

**Files:**
- Modify only if a shared RED failure remains: `src/app/globals.css`
- Modify only if a shared semantic failure remains: `src/app/layout.tsx`
- Test: all routes from Tasks 1–3 plus `/`

**Interfaces:**
- Consumes: all responsive fixes from Tasks 1–3 and existing shared header/button/form styles.
- Produces: a regression-free project with documented responsive and accessibility verification.

- [ ] **Step 1: Run the complete route matrix**

At 320, 390, 768 and 1024 px visit every route from the specification. For each route save `scrollWidth`, `clientWidth`, unexpected outside selectors, clipped text selectors, screenshot of the first viewport and screenshot near the page end.

- [ ] **Step 2: Test shared interactive states**

Open every available mobile menu, catalog filter and search surface. Navigate visible links, forms, product gallery, rails and questionnaire by keyboard. Confirm focus rings are visible and overlays stay within the viewport.

- [ ] **Step 3: Verify reduced motion**

With `prefers-reduced-motion: reduce`, confirm animated elements render immediately in their final readable position and sticky/motion scenes use their static fallback. Any correction must use the existing reduced-motion media query and must not affect normal motion.

- [ ] **Step 4: Run desktop regression**

At 1440 px inspect `/`, `/catalog`, `/product/new-01`, `/cart`, `/checkout`, `/account`, `/journal`, `/journal/japanese-approach` and `/ritual`. Confirm new CSS is inactive above 1024 px and no shared JSX change altered desktop structure.

- [ ] **Step 5: Run production verification**

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Expected: all commands exit with code 0; Next generates all configured routes without errors.

- [ ] **Step 6: Commit final shared fixes**

If Step 1–4 required changes:

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "fix: complete internal responsive regression pass"
```

If no changes were required, do not create an empty commit.
