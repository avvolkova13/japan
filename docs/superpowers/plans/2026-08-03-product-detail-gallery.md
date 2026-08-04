# Product Detail Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить страницу товара KANSO в desktop-композицию с миниатюрами, крупной галереей и компактной колонкой покупки, сохранив корзину и адаптивность.

**Architecture:** Оставить существующий `ProductDetail` client component и текущие данные товара. Заменить связанную с прокруткой страницы галерею на индексную галерею с единым состоянием `activeSlide`, drag/wheel/keyboard управлением и CSS transform-анимацией. Визуальные изменения ограничить product-detail селекторами в общем CSS.

**Tech Stack:** Next.js App Router, React, TypeScript, `next/image`, CSS custom properties.

## Global Constraints

- Не добавлять зависимости.
- Сохранить текущие цвета KANSO, существующие маршруты и логику корзины.
- Не менять главную страницу и каталог.
- Поддержать keyboard navigation, focus states, responsive layout и `prefers-reduced-motion`.

---

### Task 1: Replace gallery interaction model

**Files:**
- Modify: `src/components/product-detail.tsx`

**Interfaces:**
- Consumes: `product.galleryImages`, `product.image`, `product.hoverImage`.
- Produces: `activeSlide`, `selectSlide`, `moveGallery`, pointer drag and wheel handlers consumed by the gallery markup.

- [ ] Remove page-scroll synchronization refs/state and replace it with an index-based gallery state.
- [ ] Add thumbnail buttons with accessible labels and active state.
- [ ] Add pointer drag, wheel, ArrowLeft/ArrowRight/Home/End handling and button controls.
- [ ] Keep cart quantity/add behavior unchanged.
- [ ] Render gallery images with stable `sizes`, alt text and active slide semantics.

### Task 2: Rebuild product detail layout styles

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `.product-gallery-thumbnails`, `.product-gallery-viewport`, `.product-gallery-track`, `.product-gallery-slide`, `.product-info-panel` classes from Task 1.
- Produces: desktop three-part layout, mobile stacked layout, transition/focus/reduced-motion behavior.

- [ ] Define desktop grid for thumbnail rail, main image and purchase column.
- [ ] Make full-bleed images cover their frame and cutouts contain without blue edges.
- [ ] Add transform/opacity/scale transitions and clear active thumbnail state.
- [ ] Ensure wheel and drag surfaces do not create horizontal page overflow.
- [ ] Add mobile overrides with horizontal thumbnail rail and stacked purchase content.

### Task 3: Verify product routes and regressions

**Files:**
- Test: local routes `/product/new-01`, `/product/new-02`, `/cart`.

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Use Playwright/browser verification to confirm thumbnail click, keyboard navigation, drag/wheel behavior and add-to-cart state.
