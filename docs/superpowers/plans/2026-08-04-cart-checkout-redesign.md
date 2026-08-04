# Cart and Checkout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переработать корзину и оформление заказа в едином аккуратном редакционном стиле KANSO по утверждённому референсу.

**Architecture:** Сохранить текущую модель корзины в `localStorage` с массивом id товаров. Обновить только разметку страниц и их scoped CSS; checkout остаётся фронтовым и сохраняет заказ локально после отправки формы.

**Tech Stack:** Next.js App Router, React client components, TypeScript, CSS Modules через общий `globals.css`, `localStorage`.

## Global Constraints

- Не менять главную страницу, каталог и страницу товара.
- Не добавлять backend, зависимости или реальные платёжные интеграции.
- Не использовать слова `demo` и служебные заглушки в пользовательском интерфейсе.
- Сохранить рабочие изменения количества, удаления, перехода к оформлению и локального создания заказа.
- Учесть keyboard navigation, focus states, readable contrast, reduced motion и responsive layout.

### Task 1: Редакционная корзина

**Files:**
- Modify: `src/app/cart/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `kanso-cart`, `demoProducts`, текущие `remove`, `updateQuantity`.
- Produces: компактный список товаров, итоговый блок и переход на `/checkout`.

- [ ] Заменить перегруженную разметку корзины на структурированные header, `cart-layout`, `cart-list` и `cart-summary`; оставить quantity control и delete action.
- [ ] Добавить для каждой строки фото, бренд, название, объём, количество и стоимость позиции.
- [ ] Стилизацией сделать светлую панель корзины с разделителями, акцентной ценой и широкой кнопкой оформления.
- [ ] Добавить responsive-правила: на мобильном список и итог идут последовательно, фото остаётся читаемым, кнопки не сжимаются.

### Task 2: Двухколоночное оформление заказа

**Files:**
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `kanso-auth`, `kanso-cart`, `kanso-last-order`, выбранный способ оплаты.
- Produces: форма данных покупателя и доставки слева, summary заказа справа, success state после отправки.

- [ ] Перестроить checkout в `checkout-shell` с контентной формой и order summary.
- [ ] Сохранить поля имени, email, адреса, оплаты картой/при получении и фронтовую submit-логику.
- [ ] Сделать summary товарами с изображением, количеством и итогом вместо плотной строки текста.
- [ ] Добавить аккуратные состояния empty, auth-required и success в той же системе отступов.
- [ ] Добавить mobile layout с порядком форма → заказ и доступными focus states.

### Task 3: Проверка

**Files:**
- Test: `npm run lint`
- Test: `npm run typecheck`
- Test: `npm run build`

- [ ] Проверить `git diff --check`.
- [ ] Запустить lint, typecheck и production build последовательно.
- [ ] Проверить, что корзина продолжает менять количество, удалять товары и вести на checkout.

