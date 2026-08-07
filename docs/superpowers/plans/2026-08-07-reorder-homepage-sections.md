# Homepage Section Reorder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorder the homepage sections to match the requested KANSO storytelling flow without changing their content or behavior.

**Architecture:** Keep all existing homepage section components and data intact; change only the order of their top-level JSX siblings in `src/components/home-page.tsx`. Preserve section IDs and internal interactions so navigation and responsive behavior remain unchanged.

**Tech Stack:** Next.js, React, TypeScript, existing project CSS.

## Global Constraints

- Communication, plan, and report in Russian.
- Do not change section content, images, business data, component logic, or styles.
- Preserve all existing section IDs and links.
- Verify build and inspect the resulting homepage order.
- Do not commit or push unless explicitly requested.

---

## Task 1: Reorder homepage sections

- [ ] In `src/components/home-page.tsx`, arrange the sections in this exact order:
  1. Hero
  2. Продуманная подборка / brand rail
  3. Выбрать категорию
  4. Новинки
  5. «Японский подход к ежедневному уходу» / editorial video
  6. Хиты продаж
  7. Найти свой ритуал / quiz
  8. Увлажняющий уход / collection
  9. Философия KANSO
  10. Footer
- [ ] Keep each section's existing JSX unchanged apart from its position.
- [ ] Preserve IDs (`brands`, `category`, `new-arrivals`, `best-sellers`) and component props.

## Task 2: Verify

- [ ] Run the production build.
- [ ] Check the diff for whitespace/errors and confirm only the intended order changed.
- [ ] Inspect the homepage order in the local app if the dev server is available.

## Task 3: Handoff

- [ ] Report the changed file and verification results in Russian.
- [ ] Leave changes uncommitted and unpushed unless explicitly requested.
