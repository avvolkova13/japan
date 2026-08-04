# Quiz Pinned Media Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current reveal-based quiz imagery with a three-viewport pinned composition matching the measured Ogaki geometry and scroll sequence.

**Architecture:** Use one semantic React scene with three CSS-grid tracks. The center track is sticky and contains the portrait, copy, and button; side tracks remain in normal flow at staggered vertical offsets, so their only movement is native page scrolling.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Grid, CSS `position: sticky`.

## Global Constraints

- Do not add dependencies.
- Do not copy Ogaki source code; reproduce only the measured public behavior with project-owned code.
- The center image receives no scroll transform, rotation, scale animation, opacity transition, or reveal animation.
- Side images move only through native vertical document scrolling.
- Preserve the existing static mobile layout and provide the same layout for `prefers-reduced-motion`.

---

### Task 1: Replace the observer-driven quiz scene

**Files:**
- Modify: `src/components/home-page.tsx:82-111`
- Modify: `src/components/home-page.tsx:415-418`

**Interfaces:**
- Consumes: `VisualImage`, the existing quiz copy, and an `onStartQuiz: () => void` callback.
- Produces: `QuizPinnedScene({ onStartQuiz })`, with `.quiz-side-track-left`, `.quiz-center-track`, and `.quiz-side-track-right` as stable style hooks.

- [ ] **Step 1: Record the failing structural contract**

Run:

```bash
rg -n "IntersectionObserver|quiz-image-group|is-visible" src/components/home-page.tsx
```

Expected before implementation: matches inside `QuizImageGroup`, proving that the current scene depends on a reveal observer and does not satisfy the native-scroll contract.

- [ ] **Step 2: Replace `QuizImageGroup` with the pinned-scene component**

Use this component structure:

```tsx
function QuizPinnedScene({ onStartQuiz }: { onStartQuiz: () => void }) {
  return (
    <div className="quiz-pinned-scene">
      <div className="quiz-side-track quiz-side-track-left" aria-hidden="true">
        <VisualImage
          className="quiz-side-image"
          label=""
          src="/images/kanso/editorial.png"
          tone="tone-pearl"
        />
      </div>

      <div className="quiz-center-track">
        <div className="quiz-center-composition">
          <VisualImage
            className="quiz-image-center"
            label="Портрет для подбора личного ритуала"
            src="/images/kanso/ritual-portrait.png"
            tone="tone-pearl"
          />
          <div className="quiz-copy">
            <h2 id="quiz-title">Найти свой ритуал</h2>
            <p>Ответьте на несколько вопросов и подберите уход для своей кожи.</p>
            <button className="button button-dark" type="button" onClick={onStartQuiz}>
              <span className="button-arrow" aria-hidden="true">
                <svg className="button-arrow-icon" viewBox="0 0 20 20" fill="none" focusable="false">
                  <path d="M3.67242 12.9971V2.5H4.67242V11.9971H15.7824L15.6133 11.9455L12.4346 8.69261L13.1494 7.99339L17.209 12.1477L17.5508 12.4973L17.209 12.8469L13.1494 17.0012L12.4346 16.302L15.6162 13.0452L15.7753 12.9971H3.67242Z" fill="currentColor" />
                </svg>
              </span>
              <span className="button-label">Пройти квиз</span>
            </button>
          </div>
        </div>
      </div>

      <div className="quiz-side-track quiz-side-track-right" aria-hidden="true">
        <VisualImage
          className="quiz-side-image"
          label=""
          src="/images/kanso/wellness.png"
          tone="tone-stone"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Replace the homepage quiz markup**

Use:

```tsx
<section className="quiz-section" aria-labelledby="quiz-title">
  <QuizPinnedScene onStartQuiz={() => setNotice("Квиз пока находится в демонстрационном состоянии.")} />
</section>
```

- [ ] **Step 4: Verify the structural contract now passes**

Run:

```bash
rg -n "IntersectionObserver|quiz-image-group|is-visible" src/components/home-page.tsx
```

Expected: no matches in the quiz component.

---

### Task 2: Implement the measured desktop geometry and static fallbacks

**Files:**
- Modify: `src/app/globals.css:2186-2255`
- Modify: `src/app/globals.css:2922-2928`

**Interfaces:**
- Consumes: the class hooks produced by `QuizPinnedScene`.
- Produces: a `295vh` desktop scene, a stationary center composition, staggered side tracks, and static tablet/reduced-motion layouts.

- [ ] **Step 1: Record the failing CSS contract**

Run:

```bash
rg -n "opacity: 0|translateY\(96px\)|transition: opacity|width: 190px|height: 300px" src/app/globals.css
```

Expected before implementation: matches in the current quiz styles.

- [ ] **Step 2: Replace the desktop quiz styles**

Use this measured geometry as the initial implementation:

```css
.quiz-section {
  position: relative;
  min-height: 295vh;
  padding: 0 max(32px, calc((100vw - var(--max-width)) / 2));
  border-bottom: 1px solid var(--stone);
  text-align: left;
}

.quiz-pinned-scene {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 1.59vw, 20.4px);
  min-height: 295vh;
}

.quiz-center-track {
  grid-column: 5 / 9;
  height: 100%;
}

.quiz-center-composition {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 88px 0 24px;
}

.quiz-image-center {
  position: relative;
  left: 50%;
  flex: 0 0 auto;
  width: calc(100% + 14vw);
  max-width: 564px;
  aspect-ratio: 1.043 / 1;
  transform: translateX(-50%);
}

.quiz-copy {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.quiz-copy h2 {
  max-width: none;
  margin: 0;
  white-space: normal;
}

.quiz-copy p {
  max-width: none;
  margin: 20px 0 0;
  white-space: nowrap;
}

.quiz-copy .button {
  margin-top: 28px;
}

.quiz-side-track {
  position: relative;
  align-self: stretch;
}

.quiz-side-track-left {
  grid-column: 1 / 3;
  padding-top: calc(100vh + 88px);
}

.quiz-side-track-right {
  grid-column: 11 / 13;
  padding-top: 250vh;
}

.quiz-side-image {
  position: relative;
  left: 50%;
  width: calc(100% + 7.5vw);
  max-width: 279px;
  aspect-ratio: 0.821 / 1;
  overflow: hidden;
  opacity: 1;
  transform: translateX(-50%);
}
```

- [ ] **Step 3: Add tablet/mobile and reduced-motion fallbacks**

Under the existing mobile breakpoint and in a reduced-motion media query, use the static layout:

```css
@media (max-width: 1024px), (prefers-reduced-motion: reduce) {
  .quiz-section {
    min-height: 0;
    padding: clamp(72px, 7vw, 104px) 1rem;
    text-align: center;
  }

  .quiz-pinned-scene {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 0;
  }

  .quiz-side-track {
    display: none;
  }

  .quiz-center-track {
    width: 100%;
    height: auto;
  }

  .quiz-center-composition {
    position: static;
    height: auto;
    padding: 0;
  }

  .quiz-image-center {
    left: auto;
    width: 100%;
    max-width: none;
    aspect-ratio: 1;
    transform: none;
  }

  .quiz-copy {
    align-items: center;
    margin-top: 28px;
  }

  .quiz-copy p {
    white-space: normal;
  }
}
```

- [ ] **Step 4: Confirm the old reveal styles are gone**

Run:

```bash
rg -n "opacity: 0|translateY\(96px\)|transition: opacity|width: 190px|height: 300px" src/app/globals.css
```

Expected: no matches in the quiz styles.

---

### Task 3: Verify scroll geometry and regressions

**Files:**
- Verify: `src/components/home-page.tsx`
- Verify: `src/app/globals.css`

**Interfaces:**
- Consumes: the completed pinned scene.
- Produces: browser evidence at three scroll checkpoints and passing project checks.

- [ ] **Step 1: Run static checks**

Run:

```bash
npm run typecheck
npm run lint
git diff --check
```

Expected: all commands exit with code `0`.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: Next.js reports a successful optimized production build.

- [ ] **Step 3: Verify the desktop scroll checkpoints at `1280 × 720px`**

Open `http://localhost:3003/`, locate `.quiz-section`, and record bounding rectangles at:

1. the section start;
2. one viewport after the section start;
3. approximately `2.5` viewports after the section start.

Expected:

- `.quiz-image-center` keeps the same viewport `x` and `y` while the sticky scene is active;
- the left side image enters after the first viewport;
- the right side image enters near the last half-viewport;
- computed side-image opacity remains `1` and transform contains only horizontal centering;
- no element has a rotation matrix.

- [ ] **Step 4: Verify responsive fallbacks**

Check a mobile viewport and a desktop viewport with reduced motion.

Expected: side tracks are hidden, the center composition is in normal flow, and the section has no multi-viewport blank space.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/components/home-page.tsx src/app/globals.css public/images/kanso/ritual-portrait.png
git commit -m "feat: match pinned quiz media motion"
```
