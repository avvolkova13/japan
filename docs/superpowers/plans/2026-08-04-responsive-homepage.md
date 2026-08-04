# Responsive Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать все блоки главной страницы аккуратными и полностью читаемыми на ширинах 320–1024 px, сохранив десктопный вид от 1025 px без изменений.

**Architecture:** Сохранить текущую DOM-структуру и исправить первопричины в адаптивном CSS. Телефонные правила остаются в `max-width: 767px`, для планшета добавляется явный диапазон `768px–1024px`; полноширинные секции исключаются из общего ограничения ширины. Проверка сочетает геометрические DOM-инварианты и визуальный просмотр каждого блока.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS media queries, in-app Browser/Playwright, ESLint, TypeScript compiler.

## Global Constraints

- Изменять только отображение главной страницы на ширинах до 1024 px включительно.
- Не изменять существующие тексты, изображения, данные и бизнес-логику.
- Не изменять правила `@media (min-width: 1025px)` и итоговую десктопную композицию.
- Не добавлять зависимости.
- Сохранять намеренный внутренний горизонтальный скролл товарных рельсов без горизонтального скролла страницы.
- Сохранить keyboard navigation, focus states и `prefers-reduced-motion`.
- Не перезаписывать существующие незакоммиченные изменения пользователя.

---

### Task 1: Зафиксировать воспроизводимые адаптивные регрессии

**Files:**
- Read: `src/app/globals.css`
- Read: `src/components/home-page.tsx`
- Test: rendered homepage at `http://localhost:3003/`

**Interfaces:**
- Consumes: существующая главная страница и CSS.
- Produces: baseline-результаты для ширин 320, 375, 390, 430, 768, 820 и 1024 px.

- [ ] **Step 1: Запустить RED-проверку ширины страницы**

Для каждой контрольной ширины установить viewport, загрузить `/`, дождаться завершения начальной анимации и выполнить:

```js
const bodyFits = document.body.scrollWidth <= document.body.clientWidth;
const hero = document.querySelector('.hero-motion').getBoundingClientRect();
const heroFillsViewport = Math.abs(hero.left) <= 1 && Math.abs(hero.right - document.body.clientWidth) <= 1;
({ bodyFits, heroFillsViewport });
```

Expected before fix: `heroFillsViewport === false` на 320–1024 px.

- [ ] **Step 2: Запустить RED-проверку hero**

Собрать прямоугольники `.hero-motion h1`, `.hero-product-stage` и `.hero-motion-footer`. Проверить, что текстовые блоки не пересекаются с непрозрачной центральной областью товара и полностью находятся внутри hero.

Expected before fix: пересечение заголовка с товаром на 390, 768 и 1024 px.

- [ ] **Step 3: Запустить RED-проверку коллекции**

На 768, 820 и 1024 px сравнить `top` для `.collection-copy`, `.collection-visual` и `.collection-products` и снять скриншоты секции.

Expected before fix: `.collection-copy` начинается значительно ниже `.collection-visual`, а товары сжаты в правой колонке.

- [ ] **Step 4: Сохранить десктопный эталон**

Снять скриншоты главной страницы и ключевых секций при 1440×1000. Эти изображения используются только для сравнения после адаптивных изменений.

---

### Task 2: Исправить полноширинность и композицию hero

**Files:**
- Modify: `src/app/globals.css` в существующих адаптивных блоках около правил `.hero-motion`
- Test: rendered homepage at all control widths

**Interfaces:**
- Consumes: существующие `.hero-motion`, `.hero-motion-copy`, `.hero-product-stage`, `.hero-motion-footer`.
- Produces: отдельные телефонная и планшетная композиции без пересечений.

- [ ] **Step 1: Добавить минимальное правило полноширинности**

В адаптивном слое явно исключить hero из общего ограничения `.section-pad`:

```css
@media (max-width: 1024px) {
  .hero-motion.section-pad {
    width: 100%;
    max-width: none;
    margin-right: 0;
    margin-left: 0;
  }
}
```

- [ ] **Step 2: Проверить GREEN для ширины hero**

Повторить `bodyFits` и `heroFillsViewport` на всех контрольных ширинах.

Expected: оба значения `true` на каждой ширине.

- [ ] **Step 3: Создать самостоятельную планшетную раскладку**

В `@media (min-width: 768px) and (max-width: 1024px)` разместить заголовок слева, описание и CTA справа, а товар строго по центру. Ограничить текстовые колонки и размер товара так, чтобы их геометрические области не пересекались:

```css
@media (min-width: 768px) and (max-width: 1024px) {
  .hero-motion-copy {
    position: absolute;
    inset: 0;
    display: grid;
    min-height: 0;
    grid-template-columns: minmax(0, 1fr) minmax(15rem, 0.72fr);
    align-items: center;
    padding: 0 2rem;
  }

  .hero-motion h1 {
    position: relative;
    z-index: 2;
    width: min(36vw, 5.4ch);
    margin: 0;
    font-size: clamp(3.8rem, 7.6vw, 5.4rem);
    line-height: 0.86;
  }

  .hero-motion-footer {
    position: relative;
    z-index: 2;
    align-items: flex-start;
    flex-direction: column;
    justify-self: end;
    width: min(100%, 18rem);
  }

  .hero-product-stage {
    top: 50%;
    width: min(48vw, 30rem);
    height: min(76svh, 39rem);
    transform: translate(-50%, -50%);
  }
}
```

- [ ] **Step 4: Развести слои hero на телефоне**

В `max-width: 767px` уменьшить товар, зарезервировать ему верхнюю центральную область, разместить заголовок ниже/слева без перекрытия и сохранить CTA шириной контейнера. Для 320 px уменьшить типографику отдельным `max-width: 359px`, не меняя текст.

- [ ] **Step 5: Проверить hero визуально**

На каждой контрольной ширине проверить заголовок, бутылку, описание, кнопку, фон и нижнюю границу секции. На 320 px дополнительно проверить высоту viewport 568 px, на 390 px — 844 px, на планшете — портретную и альбомную ориентации.

---

### Task 3: Исправить сетки и содержимое всех остальных секций

**Files:**
- Modify: `src/app/globals.css` в адаптивных правилах секций главной страницы
- Test: rendered homepage section-by-section

**Interfaces:**
- Consumes: существующие header, brand rail, category, arrivals, best sellers, editorial, collection, quiz, journal и footer.
- Produces: непрерывную вертикальную страницу без наложений и обрезки.

- [ ] **Step 1: Header, поиск и меню**

Проверить 320–430 px с закрытым и открытым меню. При необходимости заменить фиксированную ширину `.header-actions` на `minmax(0, auto)`, уменьшить gap только в `max-width: 359px` и обеспечить `min-width: 0` у панелей. Touch targets оставить не меньше 44 px.

- [ ] **Step 2: Brand rail и категории**

Ограничить горизонтальный overflow `.brand-list` собственным контейнером. Проверить обе колонки категорий на 320 px: изображение, название и стрелка должны помещаться; декоративное вертикальное смещение карточек не должно пересекать следующую секцию.

- [ ] **Step 3: New Arrivals и Best Sellers**

На телефоне сохранить вертикальную редакционную карточку и двухколоночные товары только там, где минимальная ширина карточки остаётся читаемой; для 320–359 px использовать одну колонку товаров при фактическом наложении метаданных. На планшете сохранить двухколоночную композицию, но дать grid-элементам `min-width: 0`. У rail оставить внутренний `overflow-x: auto` и отрицательный отступ только в пределах секции.

- [ ] **Step 4: Editorial и коллекция**

Для планшета заменить текущую растянутую двухстрочную сетку коллекции на утверждённую последовательную композицию: копия во всю ширину сверху, широкое изображение и три товара ниже. Использовать:

```css
@media (min-width: 768px) and (max-width: 1024px) {
  .collection-inner {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }

  .collection-copy {
    grid-column: 1;
    grid-row: auto;
    max-width: 38rem;
    padding-bottom: 2rem;
  }

  .collection-visual,
  .collection-products { grid-column: 1; }
}
```

Проверить, что три карточки коллекции не обрезают названия, цену и quick-add. Editorial на телефоне должен идти в порядке изображение → заголовок → текст → кнопка.

- [ ] **Step 5: Quiz**

На планшете вернуть трёхколоночную pinned-композицию в отдельном диапазоне `768px–1024px`: центральная фотография, текст и CTA остаются неподвижными, боковые изображения поднимаются снизу и останавливаются на своих местах. Уменьшить боковые колонки и межколоночный gap пропорционально ширине, не меняя порядок анимации. На телефоне использовать статичную одноколоночную fallback-композицию, ограничить ширину CTA до согласованного контейнера и центрировать её. При `prefers-reduced-motion: reduce` использовать статичную композицию на всех ширинах.

- [ ] **Step 6: Журнал и footer**

Проверить строки карточек журнала на 320–430 px. При нехватке ширины перевести карточку в вертикальный вид вместо сжатия текста. Для footer проверить две колонки на телефоне и пять колонок на планшете; длинные ссылки должны переноситься внутри своей колонки.

- [ ] **Step 7: Проверить геометрию каждого блока**

Для каждой секции собрать `getBoundingClientRect()` всех видимых заголовков, изображений, карточек, кнопок и ссылок. Любой элемент с `left < -1`, `right > body.clientWidth + 1`, нулевой видимой площадью или пересечением с соседним контентным элементом считается ошибкой и исправляется локальным адаптивным правилом.

---

### Task 4: Проверить интерактивные и доступные состояния

**Files:**
- Modify if needed: `src/app/globals.css` только внутри адаптивных или reduced-motion правил
- Test: rendered homepage interactions

**Interfaces:**
- Consumes: меню, поиск, carousel controls, wishlist, quick-add и CTA.
- Produces: доступные состояния без скачков и перекрытий.

- [ ] **Step 1: Проверить клавиатуру**

Пройти Tab по header, карточкам, carousel controls и footer на 390 и 768 px. Focus ring должен быть видим и не обрезан `overflow`.

- [ ] **Step 2: Проверить открытые состояния**

Открыть мобильное меню и поиск, затем wishlist/quick-add на карточках. Проверить, что панели не выходят за viewport и не оказываются под соседними слоями.

- [ ] **Step 3: Проверить reduced motion**

Эмулировать `prefers-reduced-motion: reduce`, перезагрузить страницу и убедиться, что hero и quiz сразу показывают весь смысловой контент без скрытых opacity/transform состояний.

- [ ] **Step 4: Проверить консоль**

После полного прохода убедиться, что нет новых `error`, hydration warning или сообщений о недоступных ресурсах.

---

### Task 5: Финальная верификация и защита десктопа

**Files:**
- Verify: `src/app/globals.css`
- Verify: `src/components/home-page.tsx`
- Verify: `src/components/motion-observer.tsx`

**Interfaces:**
- Consumes: итоговый адаптивный CSS.
- Produces: проверенный результат этапа без десктопной регрессии.

- [ ] **Step 1: Повторить матрицу viewport**

Проверить 320×568, 375×812, 390×844, 430×932, 768×1024, 820×1180 и 1024×768. На каждой ширине пройти от header до footer и подтвердить все критерии спецификации.

- [ ] **Step 2: Сравнить десктоп**

Снять 1440×1000 после изменений и сравнить с baseline Task 1. Геометрия hero, секций и footer при 1440 px не должна измениться.

- [ ] **Step 3: Запустить статические проверки**

Run:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Expected: все команды завершаются с exit code 0, `git diff --check` не выводит ошибок.

- [ ] **Step 4: Проверить scope diff**

Просмотреть `git diff -- src/app/globals.css src/components/home-page.tsx src/components/motion-observer.tsx`. Убедиться, что новые изменения ограничены адаптивным CSS и не перезаписали существующие пользовательские изменения.

- [ ] **Step 5: Передать результат на визуальное подтверждение**

Оставить локальный сервер доступным по `http://localhost:3003/`, перечислить исправленные секции и остановиться для подтверждения пользователя перед любым дополнительным этапом или Git-действием.
