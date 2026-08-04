# KANSO Site Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one restrained, sequential appearance system to all KANSO pages and sections, inspired by the observable motion language of ZettaJoule while preserving KANSO’s existing visual direction.

**Architecture:** Use a small client-side `Reveal` component backed by `IntersectionObserver` for viewport entry, plus shared CSS keyframes for mask, image, text, card and page transitions. Existing hero motion remains the branded first-load treatment; all other content receives consistent reveal classes with explicit stagger delays and a reduced-motion fallback.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS modules through `src/app/globals.css`, native `IntersectionObserver`.

## Global Constraints

- Preserve KANSO colors, layout decisions, copy, data and existing commerce behavior.
- Do not copy ZettaJoule source code, proprietary assets, or unique visual identity; reproduce observable motion principles only.
- Do not add animation libraries or dependencies.
- Never hide content when JavaScript is unavailable or `prefers-reduced-motion: reduce` is enabled.
- Keep focus states, keyboard navigation, touch targets and responsive layouts intact.

### Task 1: Shared reveal primitive

**Files:**
- Create: `src/components/reveal.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- `Reveal` accepts `children`, optional `className`, `delay`, `variant`, and `as` props; it renders semantic content and adds `is-visible` after intersection.

- [ ] Add `Reveal` with an observer that disconnects after first visibility and cleans up on unmount.
- [ ] Add variants `mask`, `image`, `text`, `card`, and `section` using CSS custom properties for delay.
- [ ] Add base hidden-state styles, keyframes, focus-safe behavior and reduced-motion overrides.

### Task 2: Page-level and shared layout transitions

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] Add a lightweight page-shell reveal that does not delay header interaction.
- [ ] Add route/page transition styles without animating layout dimensions or causing cumulative layout shift.
- [ ] Keep the existing home hero square-mask sequence as the primary landing treatment.

### Task 3: Connect editorial and commerce pages

**Files:**
- Modify: `src/components/home-page.tsx`
- Modify: `src/app/catalog/page.tsx`
- Modify: `src/components/catalog-product-card.tsx`
- Modify: `src/components/product-detail.tsx`
- Modify: `src/app/cart/page.tsx`
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/account/page.tsx`
- Modify: `src/app/favorites/page.tsx`
- Modify: `src/app/journal/page.tsx`
- Modify: `src/app/journal/[slug]/page.tsx`
- Modify: `src/app/journal/japanese-approach/page.tsx`
- Modify: `src/app/ritual/page.tsx`

- [ ] Wrap section headings, descriptive copy, primary images and repeated cards with the correct reveal variant.
- [ ] Apply deterministic stagger values by index, capped to prevent long waits in large catalogs.
- [ ] Avoid revealing utility/header controls as if they were content; preserve immediate navigation.
- [ ] Ensure catalog card hover image swaps and product gallery controls keep their existing interaction behavior.

### Task 4: Verification and visual QA

**Files:**
- No new files unless an existing test or check requires a focused fixture.

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Visually verify desktop and mobile routes: `/`, `/catalog`, `/product/new-02`, `/cart`, `/checkout`, `/journal`, `/account`.
- [ ] Verify keyboard focus, reload behavior, scroll reveal replay rules and reduced-motion behavior.

