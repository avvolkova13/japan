# KANSO Hero Motion and Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt the Zetta Joule-inspired motion rhythm to the KANSO hero and unify the site buttons with a split-arrow hover interaction.

**Architecture:** Keep the existing single-page React client component and local assets. Add motion through CSS keyframes and state-independent classes, with a reduced-motion override. Extend the existing button and hero markup only; no new routes or dependencies.

**Tech Stack:** Next.js App Router, TypeScript, React, CSS, local PNG assets.

## Global Constraints

- Keep KANSO branding, copy, product imagery, and layout original; do not copy Zetta Joule 1:1.
- Modify only the home route and shared styles used by the home route.
- Do not install UI, animation, state-management, or icon libraries.
- Use local assets only; do not create external product claims or legal data.
- Preserve keyboard focus, touch targets, responsive behavior, and reduced-motion support.

---

### Task 1: Hero motion layers

**Files:**
- Modify: `src/components/home-page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing `VisualImage`, the transparent pump bottle render, and the home route hero markup.
- Produces: hero layers with staggered copy reveal, masked product reveal, and subtle product floating motion.

- [ ] Add project asset `public/images/kanso/kanso-pump-3d.png` as a transparent 3D-style pump bottle render for the hero.
- [ ] Add semantic hero layer classes around the existing overline, heading, description, CTA, and visual image.
- [ ] Keep the hero product image as the KANSO asset and place the motion layer behind the caption without changing its alt text.
- [ ] Add CSS animations for background reveal, text stagger, image mask reveal, blur-to-sharp, and a low-amplitude floating loop.
- [ ] Add `@media (prefers-reduced-motion: reduce)` rules that disable transforms, filters, and looping motion while leaving content visible.
- [ ] Verify the hero at 1440px and 390px with no horizontal overflow.

### Task 2: Shared split-button interaction

**Files:**
- Modify: `src/components/home-page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing `.button`, `.button-dark`, `.button-ghost`, and text CTA markup.
- Produces: a reusable visual pattern for CTA buttons with an arrow segment and label segment.

- [ ] Update existing CTA buttons to use a shared `.button-arrow` span while preserving their visible Russian labels and accessible names.
- [ ] Implement a square arrow segment with a soft blue background and a neighboring label segment.
- [ ] Implement hover and focus-visible states where the arrow shifts diagonally and the label transitions without bounce or excessive glow.
- [ ] Keep button height at least 44px and make the full control keyboard-focusable as one link or button.
- [ ] Add mobile rules that keep the control readable and full-width where the existing mobile layout requires it.

### Task 3: Verification and delivery

**Files:**
- Verify: `src/components/home-page.tsx`
- Verify: `src/app/globals.css`

**Interfaces:**
- Consumes: completed hero and button changes.
- Produces: linted, type-checked, visually inspected home route with a clean Git state.

- [ ] Run `npm run lint` and expect exit code 0.
- [ ] Run `npm run typecheck` and expect exit code 0.
- [ ] Run `npm run build` and expect the `/` route to compile successfully.
- [ ] Inspect the local page at `http://127.0.0.1:3001/` at desktop and mobile widths.
- [ ] Confirm `prefers-reduced-motion` renders the hero without movement.
- [ ] Run `git diff --check`, commit only the plan and implementation files, and push `main` after verification.
