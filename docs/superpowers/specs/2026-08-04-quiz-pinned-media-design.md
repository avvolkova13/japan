# KANSO Quiz Pinned Media Design

## Goal

Rebuild the `Найти свой ритуал` scene so its desktop scroll composition matches the observed Ogaki pinned-media behavior: the center composition remains stationary while two side images travel upward with the document at different vertical offsets.

## Measured Reference Geometry

Measurements were taken from the public Ogaki homepage at a `1280 × 720px` viewport.

- The scene uses a 12-column grid with approximately `32px` outer margins and `20px` column gaps.
- The center column group spans columns 5–8 and measures approximately `387px`.
- The rendered center image measures approximately `564 × 541px` and overflows the center grid group equally on both sides.
- Each side column group spans two columns and measures approximately `183px`.
- Each rendered side image measures approximately `279 × 340px`, overflows its grid group equally, and therefore extends partly beyond the viewport edge.
- The complete scroll scene is approximately three viewport heights.
- The left side image starts approximately one viewport below the scene start, with an additional `88px` internal offset.
- The right side image starts approximately `2.5` viewport heights below the scene start.

## Desktop Behavior

- The section is a tall scroll scene of approximately `295vh`.
- The center composition contains the existing portrait, heading, description, and KANSO button.
- The center composition uses CSS `position: sticky` and remains stationary for the active duration of the scene.
- The center image receives no scroll transform, rotation, scale, opacity transition, or reveal animation.
- The side images remain in normal document flow at measured staggered vertical offsets.
- Scrolling naturally moves the side images from below the viewport to above it.
- No JavaScript interpolation, rotation, scale, fade, or easing is applied to the side images.
- The left image occupies grid columns 1–2. The right image occupies columns 11–12.
- Side imagery may be cropped by the viewport edge but not by the section container.

## Responsive Behavior

- From `1025px` upward, preserve the 12-column pinned composition and scale measurements proportionally from the `1280px` reference viewport.
- At tablet and mobile widths, disable the long pinned scene and side-image motion.
- On tablet and mobile, show only the existing center image followed by the heading, description, and button in normal document flow.
- Respect `prefers-reduced-motion` by using the same static tablet/mobile presentation regardless of viewport width.

## Implementation Boundaries

- Modify only the quiz scene markup and its related styles.
- Reuse the existing KANSO images and copy.
- Do not add dependencies.
- Do not copy Ogaki source code; reproduce the measured public behavior with project-owned React and CSS.
- Remove the current IntersectionObserver-driven side-image reveal because it conflicts with the required scroll behavior.

## Verification

- At `1280 × 720px`, compare the scene at its start, after one viewport of scrolling, and near the end.
- Verify the center image has the same viewport coordinates at all three checkpoints while the scene is active.
- Verify the left side image enters first and the right side image enters later.
- Verify side images have no rotation, scale, or opacity change.
- Verify tablet/mobile and reduced-motion layouts remain readable and do not create excess vertical space.
- Run TypeScript, lint, production build, and `git diff --check`.
