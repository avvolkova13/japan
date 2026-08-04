# Heading Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the homepage journal heading to «Философия KANSO» and prevent reveal masks from clipping heading descenders after animations finish.

**Architecture:** Keep the existing typography scale and reveal keyframes. Change only the journal heading copy and the shared reveal animation fill mode so the initial mask applies during delay and animation, then returns to the unclipped base state.

**Tech Stack:** Next.js 16, React, TypeScript, CSS, in-app browser DOM inspection

## Global Constraints

- The journal heading copy must be exactly «Философия KANSO».
- Preserve existing font sizes, weights, letter spacing, line heights, and reveal timing.
- Do not add per-heading padding or overflow workarounds.
- After reveal completion, visible mask containers must compute to `clip-path: none`.
- Do not change card layout or copy in other sections.

---

### Task 1: Rename the homepage journal heading

**Files:**
- Modify: `src/components/home-page.tsx:427`

**Interfaces:**
- Consumes: Existing `.journal-section` and `.section-heading` structure.
- Produces: The visible `h2` copy «Философия KANSO» with the existing heading ID and styles unchanged.

- [ ] **Step 1: Run the failing copy assertion**

In the local browser, evaluate:

```js
const heading = [...document.querySelectorAll("h2")]
  .find((element) => element.closest(".journal-section"));

if (heading?.textContent?.trim() !== "Философия KANSO") {
  throw new Error(`Unexpected journal heading: ${heading?.textContent?.trim()}`);
}
```

Expected: FAIL with the current text «Заметки для тихого ритуала».

- [ ] **Step 2: Replace the heading copy**

Change the journal heading in `src/components/home-page.tsx` to:

```tsx
<h2>Философия KANSO</h2>
```

Keep the surrounding elements and attributes unchanged.

- [ ] **Step 3: Reload and rerun the copy assertion**

Expected: PASS and the heading remains on one line at desktop width.

- [ ] **Step 4: Commit the copy change**

```bash
git add src/components/home-page.tsx
git commit -m "copy: rename homepage journal heading"
```

### Task 2: Release reveal masks after animation

**Files:**
- Modify: `src/app/globals.css:1268`

**Interfaces:**
- Consumes: Existing `.motion-reveal.is-visible` animation declaration and reveal keyframes.
- Produces: The same reveal animation with `animation-fill-mode: backwards`, leaving `clip-path: none` after completion.

- [ ] **Step 1: Run the failing mask assertion**

Scroll until at least one `.motion-reveal--mask` element has completed its reveal, then evaluate:

```js
const visibleMasks = [...document.querySelectorAll(".motion-reveal--mask.is-visible")];
const clippedMasks = visibleMasks.filter(
  (element) => getComputedStyle(element).clipPath !== "none",
);

if (visibleMasks.length === 0) {
  throw new Error("No completed reveal masks found");
}

if (clippedMasks.length > 0) {
  throw new Error(`${clippedMasks.length} completed reveal masks remain clipped`);
}
```

Expected: FAIL because completed masks compute to `inset(0px 0px 0%)`.

- [ ] **Step 2: Apply the minimal shared fix**

Update the fill mode in `src/app/globals.css`:

```css
.motion-reveal.is-visible {
  animation: kanso-reveal 760ms var(--ease-soft) var(--motion-delay) backwards;
}
```

Do not change reveal duration, delay, easing, keyframes, or heading line heights.

- [ ] **Step 3: Reload and rerun the mask assertion**

Wait for the reveal animation to finish before evaluating.

Expected: PASS; every completed visible mask computes to `clip-path: none`.

- [ ] **Step 4: Visually inspect descenders**

Check the homepage headings containing lower-extending Cyrillic glyphs, including:

- «Выбрать категорию»
- «Японский подход к ежедневному уходу.»
- «Найти свой ритуал»
- «Философия KANSO» and nearby article titles containing «у» or «р»

Expected: lower glyph strokes are fully visible and reveal motion is unchanged.

- [ ] **Step 5: Run project verification**

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Expected: all commands exit with code `0`.

- [ ] **Step 6: Commit the reveal fix**

```bash
git add src/app/globals.css
git commit -m "fix: prevent heading reveal clipping"
```
