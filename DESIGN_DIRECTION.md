# DESIGN_DIRECTION.md

## Status

Stage 2 — planning only. Документ фиксирует визуальное направление KANSO и не является реализацией интерфейса.

## Concept

KANSO — премиальный editorial e-commerce японской косметики и wellness-продукции.

Сайт должен восприниматься как luxury beauty brand: спокойный, визуально уверенный, с редакционной подачей и ясной коммерческой логикой. Это не маркетплейс и не каталог с максимальной плотностью товаров. Каталог остаётся удобным, но визуальная иерархия строится вокруг образа бренда, продукта и контекста использования.

Рабочее название `KANSO` должно оставаться конфигурационным значением и не фиксироваться в визуальных компонентах.

## Reference boundaries

### JapRise

Использовать только как источник категорий, ассортимента, структуры каталога, брендов, ecommerce-функций и информационных страниц. Наблюдения: развитая иерархия категорий, разделы New Arrivals и Best Sellers, бренды, поиск коммерческого намерения, избранное, корзина, account, доставка, оплата, FAQ и контентный раздел.

Не переносить дизайн, логотип, название, тексты, контакты, юридические данные, отзывы, фотографии, баннеры и уникальные описания.

### Ogaki Digital

Использовать только luxury beauty mood, editorial-подачу, крупные изображения, воздух, спокойную композицию и контраст между коротким текстом и визуальным материалом. В доступной структуре сайта заметны короткая позиционирующая формула, крупные визуальные блоки, кейсы и аккуратная навигационная иерархия.

Не копировать фирменную айдентику, тексты, фотографии, композиции и агентскую структуру сайта.

### Zetta Joule

Использовать только как направление для motion: мягкие голубые градиенты, светлые цветовые поля, плавные переходы между состояниями, появление больших визуальных блоков и интерактивную реакцию на наведение.

Не переносить промышленную тематику, схемы, терминологию, графики, изображения и деловую структуру. Если конкретное motion-поведение не подтверждается доступным контентом страницы, считать его направлением для проверки, а не готовым паттерном.

### Brunello Cucinelli

Использовать только структуру премиального магазина: отдельные New Arrivals, product grid, фильтры, сортировку, лаконичные product cards, gallery UX, hover-состояния и editorial-коммерческие блоки. Доступная структура каталога подтверждает разделение категорий, New Arrivals, фильтров, сетки, цветовых вариантов и пагинационного продолжения.

Не копировать логотип, тексты, фотографии, товарные названия, цены, композиции, арт-дирекцию, продуктовые изображения и фирменные элементы.

## Home layout

Главная страница фиксируется строго в следующем порядке:

1. Header.
2. Hero.
3. Brand rail.
4. Shop by category.
5. New Arrivals for Her.
6. Best Sellers.
7. Editorial feature.
8. Featured collection.
9. Skin quiz.
10. Journal.
11. Footer.

Не добавлять типовые блоки `Why us`, `Advantages`, `Testimonials`, FAQ или акции, если их нет в этой структуре. Информационные и legal-страницы остаются отдельными будущими страницами из `PROJECT.md` и не вставляются в главную.

## Visual system

### Palette

Основной режим — светлый, с одной последовательной палитрой на всей странице.

| Token | Direction | Use |
|---|---|---|
| `canvas` | тёплый молочный `#F5F3EE` | основной фон страницы |
| `pearl` | жемчужный `#ECECE7` | спокойные фоновые поля и разделители зон |
| `dusty-blue` | пыльно-голубой `#C9D8DE` | мягкие editorial-подложки и category surfaces |
| `sky-blue` | небесно-голубой `#B7D8E8` | единственный цветовой акцент и интерактивные состояния |
| `stone` | серо-бежевый `#D8D2C9` | тонкие borders, нейтральные product surfaces |
| `graphite` | графитовый `#303638` | основной текст, навигация и контрастные элементы |

Мягкие голубые градиенты использовать как редкий композиционный инструмент: от pearl или very-light blue к dusty-blue/sky-blue, с низкой контрастностью и большим масштабом. Градиент должен создавать глубину секции или переход состояния, а не имитировать свечение.

Акцентный `sky-blue` занимает небольшую долю визуального поля: active/focus states, selected filters, отдельная интерактивная кнопка или цветная editorial-секция. Не использовать его одновременно как фон, текст, border и CTA в каждом блоке. Не добавлять второй яркий акцент.

Не использовать кислотные цвета, случайные градиенты, excessive glow, тяжёлые тени, crypto aesthetics, generic SaaS, шаблонный marketplace design, японские декоративные клише, generated images или прямое копирование референсов.

### Typography

- Использовать одну современную нейтральную grotesk sans-serif family для display и body, чтобы сохранить цельность бренда.
- Display: weight 500–600, плотный, но не экстремально tight; крупные заголовки должны оставаться короткими и легко сканироваться.
- Body: weight 400–450, размер 16px, line-height около 1.5.
- Micro labels: 11–12px, умеренный tracking; не ставить eyebrow перед каждым заголовком.
- Не смешивать случайный serif с sans-serif внутри одного headline. Editorial-характер создаётся масштабом, воздухом, изображением и ритмом, а не декоративной типографической эклектикой.

Размеры:

- H1: 64/68px на 1280–1440px, 48/52px на 768–1024px, 36/40px на 390–430px.
- Section heading: 40/44px desktop, 32/36px tablet, 28/32px mobile.
- Product name: 14/20px.
- Supporting copy: 16/24px, максимальная ширина около 58–65ch.
- Utility text: 12/16px.

### Container and grid

- Максимальная ширина контента: 1280px.
- При 1440px сохранять широкие поля и не растягивать контент до краёв.
- Desktop: 12-column grid, column gap 24px.
- Tablet: 8-column grid, column gap 20px.
- Mobile: 4-column logical grid, визуально — строгая одна колонка или горизонтальный rail, gap 16px.
- Базовый spacing unit: 8px.
- Вертикальный ритм секций: 128–160px desktop, 80–96px tablet, 56–72px mobile.
- Не повторять одну layout-family более одного раза подряд; чередовать full-bleed image, rail, asymmetric grid, split composition и editorial block.

### Radii, borders and depth

- Основные image surfaces и product images: 2–4px, почти квадратная геометрия.
- Интерактивные controls: full-pill только там, где это помогает обозначить действие или selected state.
- Не использовать радиусы как декоративный эффект на каждом элементе.
- Borders: 1px, low-contrast stone/pearl; применять для навигации, фильтров и разделения данных.
- Shadows: по умолчанию отсутствуют. Если elevation действительно объясняет иерархию, использовать только очень мягкую тень, окрашенную в нейтральный тон фона.
- Не превращать каждый блок в white card. Иерархию строить через фон, размер изображения, отрицательное пространство, borders и типографику.

### Product-card system

Product card — спокойный коммерческий объект, а не мини-баннер:

- image area с единым aspect-ratio внутри конкретного rail или grid;
- brand и product name в ясной типографической иерархии;
- price и подтверждённые product attributes без выдуманных рейтингов, остатков и обещаний;
- favourite и быстрые действия доступны с keyboard и touch;
- статус `New` допустим только при наличии подтверждённых demo-данных;
- hover меняет изображение или добавляет мягкое действие, но не перегружает карточку badges;
- на mobile hover заменяется tap/focus state;
- карточка не обязана иметь фон, border и shadow одновременно.

## Components and block roles

### Category card

Визуальный вход в категорию. Допускает более крупное изображение, короткое название и различающиеся aspect-ratio. Не показывает цену и не имитирует product card. На desktop может быть asymmetric grid; на mobile — вертикальный список или компактный horizontal rail.

### Product card

Повторяемая единица каталога с изображением, брендом, названием, ценой и доступными действиями. Должна быть компактнее category card и сохранять одинаковую структуру метаданных внутри одного ряда.

### New Arrivals editorial block

Переходная зона между brand story и commerce. Один hero-product или небольшая группа с большим изображением, коротким контекстом и ссылкой в каталог. Не делать его обычным четырёхколоночным product grid.

### Best Sellers rail

Горизонтальный коммерческий rail с несколькими product cards и ясным продолжением просмотра. На desktop допускает частично видимый следующий item как affordance; на mobile — native horizontal scroll с visible scrollbar/focus logic или другим явным сигналом продолжения.

### Editorial block

Полноширинная или asymmetric image-led композиция с коротким текстом. Его задача — объяснить настроение, ритуал или подборку, а не перечислить преимущества. Не использовать product-card metadata как основную структуру.

### Featured collection

Коммерческая подборка с собственным цветовым полем или крупным collection image. Должна отличаться от New Arrivals размером, ритмом и целью: collection — кураторская тема, New Arrivals — свежесть ассортимента.

### Quiz block

Спокойный интерактивный entry point к подбору ухода. Один основной вопрос или приглашение начать, понятный focus state, короткие labels. Не обещать медицинский результат и не делать quiz похожим на длинную форму.

### Journal card

Контентная карточка с изображением, категорией/датой только при наличии данных, заголовком и коротким описанием. Journal card не должна показывать цену, rating или коммерческий badge.

### Footer

Сдержанный информационный финал с навигацией по подтверждённым будущим страницам, брендовым именем, доступными контактами только после их подтверждения и legal links из `PROJECT.md`. Не добавлять выдуманные адреса, телефоны, email, условия доставки или оплаты.

## Motion system

Motion intensity: moderate. Каждая анимация должна объяснять иерархию, storytelling, feedback или state transition.

- Image reveal: изображение открывается через clip-path/mask-like reveal при входе секции, без резкого скачка layout.
- Mask reveal: использовать для hero/editorial image, чтобы направить взгляд и поддержать переход между блоками.
- Blur-to-sharp: короткий и очень мягкий переход только для крупных визуальных входов; не применять к каждому тексту.
- Staggered text: eyebrow/heading/body появляются в логической последовательности с небольшим delay; максимум один выразительный stagger на секцию.
- Image zoom: минимальный scale на hover или при переходе, без постоянного увеличения и без обрезания важного product detail.
- Hover image swap: в product card допустима смена на второе подтверждённое изображение; на touch устройствах заменяется tap/focus state.
- Directional transitions: горизонтальное движение разрешено для rails, filters и gallery, если оно показывает направление перехода.
- Цветные секции: появление через плавный background/color interpolation или мягкий crossfade, а не через вспышку.
- Scroll behavior: не использовать scroll hijack, постоянный parallax и сложные pinned effects без доказанной пользы для истории страницы.
- Не использовать одинаковый fade-in для всех блоков, резкие bounce-эффекты и чрезмерный parallax.

Для `prefers-reduced-motion: reduce` отключать blur, zoom, parallax, staggered delays и scroll-linked transitions; оставлять мгновенное появление, понятные focus/active states и полный доступ к контенту.

## Responsive behavior

Во всех вариантах запрещён горизонтальный overflow страницы. Любой rail должен быть намеренным, доступным с touch и keyboard и иметь понятный визуальный сигнал продолжения.

| Viewport | Header | Category / products | New Arrivals and editorial | Type and spacing |
|---|---|---|---|---|
| 390px | brand mark, search, bag и menu button; compact fixed/sticky behavior без переполнения | category в одну колонку или 2-up только для коротких labels; product rail с одним крупным item и частью следующего | image-first stack; text below image; no split columns | H1 36/40px; 16px side padding; section gap 56px |
| 430px | тот же mobile header, больше breathing room между controls | 2-up category допустим только при сохранении touch target; product rail 1.2–1.4 cards | hero image full width, editorial copy stacked | H1 36–40px; 20px side padding; section gap 64px |
| 768px | tablet header: brand, reduced nav, search and account/bag; menu for secondary items | 2-column category/grid or 2–3 item rail; no tiny cards | asymmetric split 5/3 или 4/4, затем single-column fallback below 768px | H1 48/52px; 32px side padding; section gap 80px |
| 1024px | full desktop navigation may appear only if it fits on one line; otherwise menu for secondary items | 3-column product grid or 3–4 item rail; filters remain compact | split composition with stable image ratio and readable copy | H1 48–56px; 40px side padding; section gap 96px |
| 1280px | full single-line header with primary categories and utility actions | 4-column product grid or controlled rail; 12-column layout | editorial block can span 7/5 or 8/4 columns; image remains dominant | H1 64/68px; max container 1280px; section gap 128px |
| 1440px | same header height and density as 1280px; expand whitespace, not navigation | 4-column grid with generous gutters; avoid overfilling viewport | use wider negative space and full-bleed image moments without stretching text | H1 64/68px; outer margins grow; section gap up to 160px |

Mobile menu must preserve the same category hierarchy as desktop, but reduce visible depth and expose primary destinations first. Touch targets: minimum 44×44px. Focus indicator must remain visible on all controls. Product rails must not rely on hover. Images must reserve their aspect-ratio space to prevent layout shift.

## Accessibility and QA gates

- Проверить semantic landmarks: header, main, nav, sections и footer.
- Проверить keyboard order, visible focus, accessible names для icon-only actions и no-hover path.
- Проверить contrast текста, controls и focus states не ниже WCAG AA.
- Проверить `prefers-reduced-motion` на всех motion-паттернах.
- Проверить 390, 430, 768, 1024, 1280 и 1440px на overflow, clipping, broken grid и touch target size.
- Проверить product card, gallery, rail, menu, filter и quiz states отдельно.
- Проверить, что demo-данные не выглядят как подтверждённые бизнес-факты.
- До этапа реализации не создавать страницы, компоненты, стили, изображения или UI-код.

## Sources consulted

- [JapRise](https://japrise.ru/) — каталог, категории, brands, ecommerce- и информационная структура.
- [Ogaki Digital](https://www.ogakidigital.com/) — prestige beauty positioning, editorial image-led composition и навигационная иерархия.
- [Zetta Joule](https://zetta-joule.com/) — светлые визуальные поля и мягкое технологичное направление; motion-паттерны требуют отдельной проверки в браузере.
- [Brunello Cucinelli](https://shop.brunellocucinelli.com/en-gb/ai) — заданный reference URL; его динамическая страница не отдала текстовый контент при проверке, поэтому product-grid и New Arrivals UX дополнительно сверены по официальной структуре каталога [New Arrivals](https://shop.brunellocucinelli.com/en-gb/sneakerswithmonili-251MZ49G2940C00104.html).
