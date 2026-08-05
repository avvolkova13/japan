# Editorial Video Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать оригинальный локальный мини-фильм KANSO и заменить статичное изображение editorial-блока scroll-сценой, которая раскрывает видео до полного viewport и показывает согласованный текстовый overlay.

**Architecture:** Визуальные кадры генерируются отдельно и собираются системным AVFoundation в H.264 MP4 без установки зависимостей. Новый клиентский компонент измеряет исходную позицию медиа, вычисляет нормализованный scroll-прогресс через `requestAnimationFrame` и передаёт геометрию в CSS custom properties. Чистая функция преобразования прогресса тестируется отдельно; mobile и reduced-motion используют статичную линейную композицию.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript 5, CSS, Apple Swift 6.3/AVFoundation/CoreImage, Node.js 24 test runner, image generation tool.

## Global Constraints

- Исходное расположение editorial-блока сохраняется на входе: медиа слева, заголовок, описание и CTA справа.
- Первый экран и товарные карточки не изменяются.
- Видео: локальный MP4, H.264, 1920×1080, 30 fps, 15–18 секунд, без звука, autoplay, muted, loop, playsInline.
- Используется одна перламутровая баночка без логотипа и одна героиня; никаких медицинских или неподтверждённых бизнес-утверждений.
- Overlay использует дословно: «ПУТЬ ОДНОЙ ФОРМУЛЫ» и «От первого прикосновения — к привычке, которая остается.»; вторая фраза курсивная.
- Desktop scroll-секция имеет высоту `220svh`, tablet — `180svh`; mobile и reduced-motion не используют pinning.
- Новые npm-зависимости не устанавливаются.
- Существующие несвязанные изменения рабочего дерева не включаются в коммиты задач.

---

### Task 1: Сгенерировать визуальную основу мини-фильма

**Files:**
- Create: `public/images/kanso/editorial-film/00-product-reference.png`
- Create: `public/images/kanso/editorial-film/00-character-reference.png`
- Create: `public/images/kanso/editorial-film/01-formula-macro.png`
- Create: `public/images/kanso/editorial-film/02-filling-line.png`
- Create: `public/images/kanso/editorial-film/03-packaging-line.png`
- Create: `public/images/kanso/editorial-film/04-city-transit.png`
- Create: `public/images/kanso/editorial-film/05-store-arrival.png`
- Create: `public/images/kanso/editorial-film/06-store-purchase.png`
- Create: `public/images/kanso/editorial-film/07-bathroom-ritual.png`
- Create: `public/images/kanso/editorial-film/08-application-close.png`
- Create: `public/images/kanso/editorial-film/09-texture-loop.png`

**Interfaces:**
- Consumes: дизайн-спецификацию `docs/superpowers/specs/2026-08-05-editorial-video-scroll-design.md`.
- Produces: девять 16:9 кадров и два reference-кадра для рендерера Task 2.

- [ ] **Step 1: Сгенерировать reference баночки**

  Использовать image generation tool с промптом:

  ```text
  Premium Japanese clean-beauty product reference, one low round pearl-white cosmetic cream jar with a subtle frosted glass base and matte ivory lid, completely blank packaging with no logo, no letters and no symbols, centered three-quarter product view, soft cool daylight, milk-beige and pale blue studio, realistic editorial photography, restrained Japanese minimalism, exact symmetrical geometry, 16:9 landscape, no hands, no additional products.
  ```

  Сохранить результат как `public/images/kanso/editorial-film/00-product-reference.png`.

- [ ] **Step 2: Сгенерировать reference героини**

  Использовать image generation tool с промптом:

  ```text
  Character reference for one adult East Asian woman in her late twenties, natural healthy skin with real texture, dark hair in a loose low bun, calm expression, ivory sleeveless top, minimal makeup, soft cool morning daylight, milk-beige Japanese bathroom interior, premium clean-girl editorial photography, head and shoulders, three-quarter profile, 16:9 landscape, no product and no text.
  ```

  Сохранить результат как `public/images/kanso/editorial-film/00-character-reference.png`.

- [ ] **Step 3: Сгенерировать девять кадров фильма**

  Использовать reference-изображения для сохранения баночки и героини. Общая арт-дирекция для каждого кадра: realistic premium editorial film still, restrained Japanese clean-beauty aesthetic, soft daylight, milk-beige/pale-blue/cool-gray palette, subtle film grain, natural highlights, 16:9 landscape, no readable text, no logos, no watermark.

  | File | Scene prompt |
  |---|---|
  | `01-formula-macro.png` | Extreme macro overhead view of glossy ivory face cream folding in a pristine stainless cosmetic mixing vessel, slow spiral geometry, luminous soft reflections, sterile but warm laboratory atmosphere. |
  | `02-filling-line.png` | The exact pearl-white reference jar being precisely filled with ivory cream on a minimal stainless production line, one filling nozzle, shallow depth of field, no workers in frame. |
  | `03-packaging-line.png` | Three identical reference jars moving in a calm diagonal rhythm on a pale conveyor, one jar sharp in the foreground, bright clean production room, quiet precision. |
  | `04-city-transit.png` | The exact boxed blank pearl-white jar visible through a clean glass delivery case inside a quiet modern electric van, soft Japanese city reflections sliding across the window, no commercial markings. |
  | `05-store-arrival.png` | The exact reference jar displayed on a pale stone shelf in a minimal Japanese beauty store, cool daylight, generous negative space, a blurred attendant arranging the shelf in the distance. |
  | `06-store-purchase.png` | The exact adult woman from the character reference gently taking the exact pearl-white jar from the pale stone shelf, elegant side profile, natural hand anatomy, quiet editorial store scene. |
  | `07-bathroom-ritual.png` | The same woman at home in the same light Japanese bathroom, opening the exact jar near a stone sink and round mirror, early morning daylight, intimate medium-wide framing. |
  | `08-application-close.png` | Close three-quarter portrait of the same woman applying a small amount of ivory cream to her cheek with two fingertips, natural skin texture, the exact open jar held low in frame, calm expression. |
  | `09-texture-loop.png` | Extreme macro of the same ivory cream forming a soft circular ridge on a fingertip, composition and spiral direction visually matching frame 01 for a seamless match cut. |

- [ ] **Step 4: Проверить визуальную непрерывность**

  Открыть все 11 изображений и подтвердить: баночка совпадает по форме и материалу; лицо, волосы и одежда героини совпадают; отсутствуют логотипы, псевдотекст, лишние пальцы и неподходящие оттенки. Несоответствующий кадр регенерировать до сборки видео.

- [ ] **Step 5: Зафиксировать только generated frames**

  ```bash
  git add public/images/kanso/editorial-film
  git commit -m "assets: add KANSO editorial film frames"
  ```

---

### Task 2: Собрать локальный H.264 MP4

**Files:**
- Create: `scripts/render-editorial-video.swift`
- Create: `public/videos/kanso/editorial-ritual.mp4`
- Create: `public/videos/kanso/editorial-ritual-poster.jpg`

**Interfaces:**
- Consumes: все девять scene-файлов `01-formula-macro.png`–`09-texture-loop.png` из Task 1.
- Produces: `public/videos/kanso/editorial-ritual.mp4` и poster для `<video>`.

- [ ] **Step 1: Создать AVFoundation renderer**

  Реализовать в `scripts/render-editorial-video.swift` следующие точные параметры и интерфейсы:

  ```swift
  import AVFoundation
  import CoreImage
  import CoreImage.CIFilterBuiltins
  import CoreVideo
  import Foundation

  let width = 1920
  let height = 1080
  let fps: Int32 = 30
  let secondsPerShot = 2.05
  let transitionSeconds = 0.38
  let sceneFiles = (1...9).map { index in
      String(format: "public/images/kanso/editorial-film/%02d-%@.png", index, [
          "formula-macro", "filling-line", "packaging-line", "city-transit",
          "store-arrival", "store-purchase", "bathroom-ritual",
          "application-close", "texture-loop"
      ][index - 1])
  }
  let outputPath = "public/videos/kanso/editorial-ritual.mp4"
  ```

  Рендерер должен:

  - создать `AVAssetWriter` с codec `.h264`, 1920×1080 и average bitrate `8_000_000`;
  - создать `AVAssetWriterInputPixelBufferAdaptor` с `kCVPixelFormatType_32BGRA`;
  - загрузить каждый PNG через `CIImage(contentsOf:)`;
  - aspect-fill кадр до 1920×1080 и обрезать по центру;
  - применить к каждому кадру линейный Ken Burns scale `1.00 → 1.045`, чередуя направление горизонтального сдвига на `±28 px`;
  - смешать соседние кадры через `CISourceOverCompositing` в течение `0.38 s`;
  - записать ровно 30 кадров в секунду с presentation time `CMTime(value: frameIndex, timescale: fps)`;
  - завершить последний кадр композицией, визуально совместимой с первым, без дополнительного fade-to-black.

- [ ] **Step 2: Отрендерить видео**

  ```bash
  mkdir -p public/videos/kanso
  swift scripts/render-editorial-video.swift
  ```

  Expected: процесс завершается с `Rendered public/videos/kanso/editorial-ritual.mp4` и exit code `0`.

- [ ] **Step 3: Создать poster**

  Использовать `sips` для конвертации полноэкранного кадра магазина без изменения исходного PNG:

  ```bash
  sips -s format jpeg -s formatOptions 86 public/images/kanso/editorial-film/05-store-arrival.png --out public/videos/kanso/editorial-ritual-poster.jpg
  ```

- [ ] **Step 4: Проверить media metadata**

  ```bash
  mdls -name kMDItemDurationSeconds -name kMDItemCodecs -name kMDItemPixelWidth -name kMDItemPixelHeight public/videos/kanso/editorial-ritual.mp4
  ```

  Expected: продолжительность между `15` и `18` секундами, codec H.264, width `1920`, height `1080`.

- [ ] **Step 5: Зафиксировать renderer и видео**

  ```bash
  git add scripts/render-editorial-video.swift public/videos/kanso/editorial-ritual.mp4 public/videos/kanso/editorial-ritual-poster.jpg
  git commit -m "assets: render editorial ritual film"
  ```

---

### Task 3: Реализовать и протестировать scroll state mapping

**Files:**
- Create: `src/lib/editorial-scroll.ts`
- Create: `src/lib/editorial-scroll.test.ts`

**Interfaces:**
- Produces: `getEditorialScrollState(progress: number): EditorialScrollState`.
- Consumed by: `src/components/editorial-video-scroll.tsx` in Task 4.

- [ ] **Step 1: Написать failing tests**

  Создать `src/lib/editorial-scroll.test.ts`:

  ```ts
  import assert from "node:assert/strict";
  import test from "node:test";
  import { getEditorialScrollState } from "./editorial-scroll.ts";

  test("clamps progress outside the scene", () => {
    assert.equal(getEditorialScrollState(-1).progress, 0);
    assert.equal(getEditorialScrollState(2).progress, 1);
  });

  test("keeps the opening composition before pin growth", () => {
    const state = getEditorialScrollState(0.18);
    assert.equal(state.mediaProgress, 0);
    assert.equal(state.overlayProgress, 0);
    assert.equal(state.copyOpacity, 1);
  });

  test("finishes media growth before revealing overlay", () => {
    const state = getEditorialScrollState(0.68);
    assert.equal(state.mediaProgress, 1);
    assert.equal(state.overlayProgress, 0);
    assert.equal(state.copyOpacity, 0);
  });

  test("reveals the approved overlay by the hold phase", () => {
    const state = getEditorialScrollState(0.82);
    assert.equal(state.mediaProgress, 1);
    assert.equal(state.overlayProgress, 1);
  });
  ```

- [ ] **Step 2: Запустить тест и подтвердить RED**

  ```bash
  node --experimental-strip-types --test src/lib/editorial-scroll.test.ts
  ```

  Expected: FAIL с `ERR_MODULE_NOT_FOUND` для `editorial-scroll.ts`.

- [ ] **Step 3: Реализовать mapping**

  Создать `src/lib/editorial-scroll.ts`:

  ```ts
  export type EditorialScrollState = {
    progress: number;
    mediaProgress: number;
    overlayProgress: number;
    copyOpacity: number;
  };

  const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

  const smoothstep = (start: number, end: number, value: number) => {
    const normalized = clamp01((value - start) / (end - start));
    return normalized * normalized * (3 - 2 * normalized);
  };

  export function getEditorialScrollState(rawProgress: number): EditorialScrollState {
    const progress = clamp01(rawProgress);
    return {
      progress,
      mediaProgress: smoothstep(0.18, 0.55, progress),
      overlayProgress: smoothstep(0.68, 0.82, progress),
      copyOpacity: 1 - smoothstep(0.18, 0.34, progress),
    };
  }
  ```

- [ ] **Step 4: Запустить тест и подтвердить GREEN**

  ```bash
  node --experimental-strip-types --test src/lib/editorial-scroll.test.ts
  ```

  Expected: `4` tests pass, `0` fail.

- [ ] **Step 5: Зафиксировать mapping**

  ```bash
  git add src/lib/editorial-scroll.ts src/lib/editorial-scroll.test.ts
  git commit -m "test: define editorial scroll timeline"
  ```

---

### Task 4: Создать scroll-компонент и подключить его на главной

**Files:**
- Create: `src/components/editorial-video-scroll.tsx`
- Modify: `src/components/home-page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `getEditorialScrollState`, MP4 и poster из Task 2.
- Produces: `<EditorialVideoScroll />`, полностью заменяющий текущую разметку `.editorial-section`.

- [ ] **Step 1: Создать клиентский компонент**

  Компонент должен экспортировать `EditorialVideoScroll`, содержать refs `sectionRef`, `stageRef`, `originRef`, `mediaRef`, определять reduced motion через `matchMedia`, а в пассивном scroll listener обновлять сцену только внутри одного `requestAnimationFrame`.

  Основная разметка:

  ```tsx
  <section ref={sectionRef} className="editorial-scroll" aria-labelledby="editorial-title">
    <div ref={stageRef} className="editorial-scroll-stage">
      <div className="editorial-scroll-grid section-pad">
        <div ref={originRef} className="editorial-scroll-origin" aria-hidden="true" />
        <div className="editorial-copy editorial-scroll-copy">
          <p className="micro-label">Редакция</p>
          <h2 id="editorial-title">Японский подход к ежедневному уходу.</h2>
          <p>История о небольших повторяемых жестах, из которых складывается личный ритуал.</p>
          <Link className="button button-dark" href="/journal/japanese-approach">
            <span className="button-arrow" aria-hidden="true">
              <svg className="button-arrow-icon" viewBox="0 0 20 20" fill="none" focusable="false">
                <path d="M3.67242 12.9971V2.5H4.67242V11.9971H15.7824L15.6133 11.9455L12.4346 8.69261L13.1494 7.99339L17.209 12.1477L17.5508 12.4973L17.209 12.8469L13.1494 17.0012L15.6162 13.0452L15.7753 12.9971H3.67242Z" fill="currentColor" />
              </svg>
            </span>
            <span className="button-label">Читать историю</span>
          </Link>
        </div>
      </div>
      <div ref={mediaRef} className="editorial-scroll-media" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata" poster="/videos/kanso/editorial-ritual-poster.jpg">
          <source src="/videos/kanso/editorial-ritual.mp4" type="video/mp4" />
        </video>
        <div className="editorial-scroll-shade" />
        <div className="editorial-scroll-overlay">
          <span className="editorial-scroll-line" />
          <p>ПУТЬ ОДНОЙ ФОРМУЛЫ</p>
          <p><em>От первого прикосновения — к привычке, которая остается.</em></p>
        </div>
      </div>
    </div>
  </section>
  ```

  На video error добавить класс `has-video-error`, который показывает fallback background `url('/images/kanso/editorial-ritual.png')`.

- [ ] **Step 2: Реализовать измерение и обновление geometry**

  В `measure()` сохранить rect элемента `editorial-scroll-origin` относительно sticky stage. В `update()` вычислять:

  ```ts
  const scrollDistance = section.offsetHeight - window.innerHeight;
  const rawProgress = scrollDistance > 0 ? -section.getBoundingClientRect().top / scrollDistance : 0;
  const state = getEditorialScrollState(rawProgress);
  const left = origin.left * (1 - state.mediaProgress);
  const top = origin.top * (1 - state.mediaProgress);
  const width = origin.width + (window.innerWidth - origin.width) * state.mediaProgress;
  const height = origin.height + (window.innerHeight - origin.height) * state.mediaProgress;
  media.style.setProperty("--media-left", `${left}px`);
  media.style.setProperty("--media-top", `${top}px`);
  media.style.setProperty("--media-width", `${width}px`);
  media.style.setProperty("--media-height", `${height}px`);
  media.style.setProperty("--media-radius", `${6 * (1 - state.mediaProgress)}px`);
  media.style.setProperty("--overlay-progress", String(state.overlayProgress));
  media.style.setProperty("--overlay-offset", `${18 * (1 - state.overlayProgress)}px`);
  stage.style.setProperty("--copy-opacity", String(state.copyOpacity));
  ```

  На resize вызвать `measure()` и `update()`. При reduced motion вызвать `video.pause()` и сбросить сложную геометрию. На unmount удалить scroll, resize и media-query listeners и отменить pending animation frame.

- [ ] **Step 3: Подключить компонент**

  В `src/components/home-page.tsx` импортировать:

  ```ts
  import { EditorialVideoScroll } from "@/components/editorial-video-scroll";
  ```

  Удалить текущую секцию с классом `section-pad editorial-section` целиком и вставить на её место:

  ```tsx
  <EditorialVideoScroll />
  ```

- [ ] **Step 4: Добавить desktop/tablet/mobile CSS**

  В `src/app/globals.css` заменить старые правила `.editorial-section` новыми:

  ```css
  .editorial-scroll { position: relative; height: 220svh; }
  .editorial-scroll-stage { position: sticky; top: 0; height: 100svh; overflow: hidden; background: var(--canvas); }
  .editorial-scroll-grid { display: grid; height: 100%; grid-template-columns: minmax(0, .9fr) minmax(280px, 1.1fr); gap: clamp(36px, 5vw, 80px); align-items: center; }
  .editorial-scroll-origin { aspect-ratio: 1.25; }
  .editorial-scroll-copy { opacity: var(--copy-opacity, 1); transition: visibility 0s linear; }
  .editorial-scroll-media { position: absolute; left: var(--media-left); top: var(--media-top); width: var(--media-width); height: var(--media-height); overflow: hidden; border-radius: var(--media-radius); background: var(--stone) center / cover no-repeat; }
  .editorial-scroll-media video { width: 100%; height: 100%; object-fit: cover; }
  .editorial-scroll-media.has-video-error { background-image: url('/images/kanso/editorial-ritual.png'); }
  .editorial-scroll-media.has-video-error video { visibility: hidden; }
  .editorial-scroll-shade { position: absolute; inset: 45% 0 0; background: linear-gradient(to bottom, transparent, rgb(18 21 20 / .34)); opacity: var(--overlay-progress); }
  .editorial-scroll-overlay { position: absolute; right: clamp(24px, 3vw, 48px); bottom: clamp(28px, 8vh, 86px); left: clamp(24px, 3vw, 48px); display: grid; grid-template-columns: .9fr 1.1fr; gap: clamp(32px, 8vw, 140px); color: #f7f4ed; opacity: var(--overlay-progress); transform: translateY(var(--overlay-offset)); }
  .editorial-scroll-line { position: absolute; top: -20px; right: 0; left: 0; height: 1px; background: currentColor; transform: scaleX(var(--overlay-progress)); transform-origin: left; }
  .editorial-scroll-overlay p { margin: 0; font-size: clamp(.8rem, 1.35vw, 1.25rem); line-height: 1.28; }
  .editorial-scroll-overlay p:last-child { justify-self: end; max-width: 30rem; font-size: clamp(1.2rem, 2.15vw, 2rem); }
  ```

  Tablet `768–1024px`: `.editorial-scroll { height: 180svh; }`. Mobile `≤767px` и reduced motion: `height:auto`, stage `position:relative;height:auto;overflow:visible`, grid one column, media returns to normal flow. Для `.editorial-scroll-overlay` установить `position:static`, `grid-template-columns:1fr`, `color:var(--graphite)`, `opacity:1`, `transform:none`, `padding-top:20px`; для линии установить `position:static`, `display:block`, `margin-bottom:16px`, `transform:none`. При reduced motion video poster остаётся видимым без autoplay.

- [ ] **Step 5: Запустить static checks**

  ```bash
  npm run typecheck
  npm run lint
  ```

  Expected: оба процесса завершаются с exit code `0`.

- [ ] **Step 6: Зафиксировать компонент**

  ```bash
  git add src/components/editorial-video-scroll.tsx src/components/home-page.tsx src/app/globals.css
  git commit -m "feat: add expanding editorial video scene"
  ```

---

### Task 5: Visual QA и regression verification

**Files:**
- Modify only after reproducing a QA defect: `src/components/editorial-video-scroll.tsx`, `src/app/globals.css`, `scripts/render-editorial-video.swift`.

**Interfaces:**
- Consumes: полностью собранную сцену Tasks 1–4.
- Produces: проверенный desktop/tablet/mobile результат без регрессий.

- [ ] **Step 1: Запустить dev server**

  ```bash
  npm run dev -- --hostname 127.0.0.1 --port 3003
  ```

- [ ] **Step 2: Проверить desktop 1440×1000 покадрово**

  Открыть `http://127.0.0.1:3003/` и зафиксировать состояния прогресса `0`, `0.35`, `0.60`, `0.76`, `0.88`, `1.0`.

  Expected:

  - в `0` исходная композиция совпадает с текущей сеткой;
  - в `0.35` видео растёт без скачка, правый текст уходит;
  - в `0.60` видео заполняет viewport и border-radius равен `0`;
  - в `0.76` линия и оба текста проявляются;
  - в `0.88` текст читаем, video продолжает loop;
  - в `1.0` следующая секция входит обычным вертикальным скроллом.

- [ ] **Step 3: Проверить обратный и быстрый scroll**

  Прокрутить сцену вниз, затем вверх, затем резко пересечь всю секцию. Expected: прогресс обратим, sticky stage не остаётся закреплённым, overlay не мерцает, секции не накладываются.

- [ ] **Step 4: Проверить tablet, mobile и reduced motion**

  Проверить 834×1112 и 390×844. Затем эмулировать `prefers-reduced-motion: reduce`.

  Expected: tablet использует `180svh`; mobile показывает обычный видео-блок и подписи под ним; reduced motion показывает poster без autoplay и без pinning; горизонтального overflow нет.

- [ ] **Step 5: Проверить runtime и production build**

  ```bash
  npm run typecheck
  npm run lint
  npm run build
  ```

  Expected: все команды завершаются с exit code `0`; в browser console отсутствуют ошибки, относящиеся к editorial-сцене.

- [ ] **Step 6: Проверить итоговый diff**

  ```bash
  git diff --check
  git status --short
  ```

  Expected: нет whitespace errors; список изменений содержит только согласованные assets, renderer, scroll helper/test, компонент, подключение и CSS плюс существующие пользовательские изменения.

- [ ] **Step 7: Зафиксировать только QA-исправления, если они появились**

  ```bash
  git add src/components/editorial-video-scroll.tsx src/app/globals.css scripts/render-editorial-video.swift
  git commit -m "fix: polish editorial video scroll behavior"
  ```
