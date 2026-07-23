"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { demoProducts } from "@/data/demo-products";
import { siteConfig } from "@/config/site";

const brands = [
  "Hada Labo",
  "Rohto",
  "FANCL",
  "Shiseido",
  "Senka",
  "Biore",
  "Curel",
  "DHC",
  "Kracie",
  "KOSÉ",
];

const categories = [
  ["Face", "Продуманный уход для кожи каждый день.", "tone-pearl", "/images/kanso/face.png"],
  ["Hair", "Уход за блеском, мягкостью и ритуалом.", "tone-blue", "/images/kanso/hair.png"],
  ["Body", "Небольшие жесты заботы, выбранные осознанно.", "tone-stone", "/images/kanso/body.png"],
  ["Sun Care", "Лёгкие текстуры для ежедневной защиты.", "tone-sky", "/images/kanso/sun-care.png"],
  ["Wellness", "Простые средства для более мягкого ритма.", "tone-pearl-deep", "/images/kanso/wellness.png"],
  ["Sets", "Собранные ритуалы, готовые стать подарком.", "tone-blue-soft", "/images/kanso/sets.png"],
] as const;

const categoryLabels: Record<string, string> = {
  Face: "Лицо",
  Hair: "Волосы",
  Body: "Тело",
  "Sun Care": "Солнцезащита",
  Wellness: "Здоровье и баланс",
  "Oral Care": "Полость рта",
  Sets: "Наборы",
  Devices: "Аппараты",
};

const journalStories = [
  ["РИТУАЛЫ", "Как выстроить простой японский уход", "Спокойная отправная точка для продуманной ежедневной рутины.", "tone-pearl", "/images/kanso/editorial.png"],
  ["ТЕКСТУРЫ", "Солнцезащита каждый день: как выбрать текстуру", "О том, как найти комфортное покрытие для ежедневного ухода.", "tone-sky", "/images/kanso/sun-care.png"],
  ["УТРО", "Пять тихих ритуалов красоты для насыщенного утра", "Небольшие жесты, которые делают привычное утро более осознанным.", "tone-stone", "/images/kanso/wellness.png"],
] as const;

const newArrivals = demoProducts.filter((product) => product.id.startsWith("new-"));
const bestSellers = demoProducts.filter((product) => product.id.startsWith("best-"));
const featuredProducts = demoProducts.filter((product) => ["new-01", "best-02", "best-04"].includes(product.id));

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

function VisualImage({
  label,
  src,
  tone = "tone-pearl",
  className = "",
  secondary = false,
  overlayText,
}: {
  label: string;
  src: string;
  tone?: string;
  className?: string;
  secondary?: boolean;
  overlayText?: string;
}) {
  return (
    <div
      className={`visual-placeholder visual-image ${tone} ${secondary ? "visual-placeholder-secondary" : ""} ${className}`}
    >
      <Image src={src} alt={label} fill sizes="(max-width: 767px) 100vw, 50vw" />
      {overlayText && <span className="visual-product-label">{overlayText}</span>}
    </div>
  );
}

function ProductCard({
  product,
  wished,
  added,
  onWishlist,
  onQuickAdd,
}: {
  product: (typeof demoProducts)[number];
  wished: boolean;
  added: boolean;
  onWishlist: () => void;
  onQuickAdd: () => void;
}) {
  return (
    <article className="product-card">
      <div className="product-media">
        <VisualImage label={`${product.brand} ${product.name}`} src={product.image} tone="tone-product" />
        <VisualImage label={`${product.brand} ${product.name}, альтернативный вид`} src={product.hoverImage} tone="tone-product-alt" secondary />
        <div className="product-image-print" aria-hidden="true">
          <span>{product.brand}</span>
          <strong>{product.name}</strong>
        </div>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`icon-button wishlist-button ${wished ? "is-active" : ""}`}
          type="button"
          aria-label={wished ? `Убрать ${product.name} из избранного` : `Добавить ${product.name} в избранное`}
          aria-pressed={wished}
          onClick={onWishlist}
        >
          <svg className="wishlist-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M20.8 8.7c0 5.1-8.8 10.3-8.8 10.3S3.2 13.8 3.2 8.7C3.2 6 5.2 4 7.8 4c1.7 0 3.1.9 4.2 2.2C13.1 4.9 14.5 4 16.2 4c2.6 0 4.6 2 4.6 4.7Z" />
          </svg>
        </button>
        <div className="product-hover-info" aria-hidden="true">
          <span>{product.brand}</span>
          <strong>{product.name}</strong>
        </div>
        <button className="quick-add" type="button" onClick={onQuickAdd}>
          {added ? "Добавлено" : "Добавить"}
        </button>
      </div>
      <div className="product-meta">
        <p className="product-brand">{product.brand}</p>
        <h3>{product.name}</h3>
        <div className="product-subline">
          <span>{product.volume}</span>
          <span>{formatPrice(product.price)}</span>
        </div>
      </div>
    </article>
  );
}

export function HomePage() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState("");
  const bestRailRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const toggleWishlist = (id: string, name: string) => {
    setWishlist((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
        setNotice(`${name} удалён из избранного.`);
      } else {
        next.add(id);
        setNotice(`${name} добавлен в избранное.`);
      }
      return next;
    });
  };

  const toggleAdded = (id: string, name: string) => {
    setAdded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
        setNotice(`${name} удалён из подборки.`);
      } else {
        next.add(id);
        setNotice(`${name} добавлен в подборку.`);
      }
      return next;
    });
  };

  const scrollBestSellers = (direction: number) => {
    bestRailRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!bestRailRef.current) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: bestRailRef.current.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !bestRailRef.current) return;
    bestRailRef.current.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.startX);
  };

  const handlePointerUp = () => {
    dragState.current.active = false;
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand-mark" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="В начало страницы">
            {siteConfig.publicBrandName}
          </button>
          <nav className={`desktop-nav ${mobileMenuOpen ? "is-mobile-open" : ""}`} aria-label="Основная навигация">
            <button className={`nav-link catalog-trigger ${catalogOpen ? "is-active" : ""}`} type="button" onClick={() => setCatalogOpen((open) => !open)} aria-expanded={catalogOpen}>
              Каталог <span className="catalog-chevron" aria-hidden="true" />
            </button>
            <a className="nav-link" href="#new-arrivals" onClick={closeMobileMenu}>Новинки</a>
            <a className="nav-link" href="#best-sellers" onClick={closeMobileMenu}>Хиты продаж</a>
            <a className="nav-link" href="#brands" onClick={closeMobileMenu}>Бренды</a>
            <a className="nav-link" href="#journal" onClick={closeMobileMenu}>Журнал</a>
          </nav>
          <div className="header-actions">
            <button className="utility-link search-trigger" type="button" onClick={() => setSearchOpen((open) => !open)} aria-expanded={searchOpen}>Поиск</button>
            <button className="utility-link desktop-only" type="button" onClick={() => setNotice("Личный кабинет пока находится в демонстрационном состоянии.")}>Кабинет</button>
            <button className="utility-link responsive-utility wishlist-nav" type="button" onClick={() => setNotice(`В избранном: ${wishlist.size} ${wishlist.size === 1 ? "товар" : "товаров"}.`)}>Избранное</button>
            <button className="utility-link responsive-utility cart-nav" type="button" onClick={() => setNotice(`В подборке: ${added.size} ${added.size === 1 ? "товар" : "товаров"}.`)}>Корзина</button>
            <button className="menu-trigger" type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label="Открыть меню">
              <span>{mobileMenuOpen ? "Закрыть" : "Меню"}</span>
            </button>
          </div>
        </div>
        {catalogOpen && (
          <div className="mega-menu" role="region" aria-label="Категории каталога">
            <div className="mega-menu-inner">
              <p className="micro-label">Каталог</p>
              <div className="mega-grid">
                {["Face", "Hair", "Body", "Sun Care", "Wellness", "Oral Care", "Sets", "Devices"].map((category) => (
                  <a key={category} href="#category" onClick={() => setCatalogOpen(false)}>{categoryLabels[category]}<span aria-hidden="true">↗</span></a>
                ))}
              </div>
            </div>
          </div>
        )}
        {searchOpen && (
          <div className="search-panel" role="search">
            <div className="search-panel-inner">
              <label htmlFor="demo-search">Поиск по KANSO</label>
              <input id="demo-search" type="search" placeholder="Поиск пока в демонстрационном состоянии" onChange={(event) => setNotice(event.target.value ? `Поиск: ${event.target.value}` : "")} />
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="hero hero-motion section-pad" aria-labelledby="hero-title">
          <div className="hero-motion-copy">
            <p className="overline">Японский уход, собранный осознанно</p>
            <h1 id="hero-title"><span>Тихий</span><span>ритуал</span><span>для кожи.</span></h1>
            <div className="hero-motion-footer">
              <p className="hero-description">Японская косметика, средства для здоровья и бьюти-ритуалы для современного ритма жизни.</p>
              <a className="button button-dark" href="#category"><span className="button-arrow" aria-hidden="true">↘</span><span className="button-label">Смотреть подборку</span></a>
            </div>
          </div>
          <div className="hero-product-stage">
            <VisualImage className="hero-product-image" label="Премиальный очищающий флюид KANSO" src="/images/kanso/kanso-pump-open-premium.png" tone="tone-hero" />
          </div>
        </section>

        <section className="brand-rail section-pad-small" id="brands" aria-label="Избранные бренды">
          <p className="micro-label">Продуманная подборка</p>
          <div className="brand-list">{brands.map((brand) => <span key={brand}>{brand}</span>)}</div>
        </section>

        <section className="section-pad category-section" id="category" aria-labelledby="category-title">
          <div className="section-heading">
            <p className="micro-label">Начните с ритуала</p>
            <h2 id="category-title">Выбрать категорию</h2>
          </div>
          <div className="category-grid">
            {categories.map(([category, copy, tone, image]) => (
              <a className="category-card" href="#new-arrivals" key={category}>
                <VisualImage label={`Категория: ${categoryLabels[category]}`} src={image} tone={tone} />
                <div className="category-card-copy"><div><h3>{categoryLabels[category]}</h3><p>{copy}</p></div><span className="round-arrow" aria-hidden="true">↗</span></div>
              </a>
            ))}
          </div>
        </section>

        <section className="section-pad new-arrivals-section" id="new-arrivals" aria-labelledby="new-arrivals-title">
          <div className="section-heading split-heading">
            <div><p className="micro-label">Только что появились</p><h2 id="new-arrivals-title">Новинки для неё</h2></div>
            <p>Новые позиции в подборке KANSO.</p>
          </div>
          <div className="new-arrivals-layout">
            <div className="editorial-visual"><VisualImage label="Редакционная композиция новинок" src="/images/kanso/collection.png" tone="tone-blue" /><p className="image-note">Более мягкое начало сезона.</p></div>
            <div className="product-grid new-arrivals-grid">
              {newArrivals.map((product) => <ProductCard key={product.id} product={product} wished={wishlist.has(product.id)} added={added.has(product.id)} onWishlist={() => toggleWishlist(product.id, product.name)} onQuickAdd={() => toggleAdded(product.id, product.name)} />)}
            </div>
            <div className="section-cta"><a className="text-link" href="#new-arrivals">Все новинки <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        <section className="section-pad best-sellers-section" id="best-sellers" aria-labelledby="best-sellers-title">
          <div className="section-heading rail-heading"><div><p className="micro-label">Знакомые фавориты</p><h2 id="best-sellers-title">Хиты продаж</h2></div><div className="rail-controls"><button className="round-arrow control-button" type="button" onClick={() => scrollBestSellers(-1)} aria-label="Предыдущие хиты продаж">←</button><button className="round-arrow control-button" type="button" onClick={() => scrollBestSellers(1)} aria-label="Следующие хиты продаж">→</button></div></div>
          <div className="product-rail" ref={bestRailRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
            {bestSellers.map((product) => <ProductCard key={product.id} product={product} wished={wishlist.has(product.id)} added={added.has(product.id)} onWishlist={() => toggleWishlist(product.id, product.name)} onQuickAdd={() => toggleAdded(product.id, product.name)} />)}
          </div>
        </section>

        <section className="section-pad editorial-section" aria-labelledby="editorial-title">
          <div className="editorial-large-visual"><VisualImage label="Редакционная композиция о красоте" src="/images/kanso/editorial.png" tone="tone-stone" /></div>
          <div className="editorial-copy"><p className="micro-label">Редакция</p><h2 id="editorial-title">Японский подход к ежедневному уходу.</h2><p>История о небольших повторяемых жестах, из которых складывается личный ритуал.</p><a className="text-link" href="#journal">Читать историю <span aria-hidden="true">↗</span></a></div>
        </section>

        <section className="collection-section section-pad" aria-labelledby="collection-title">
          <div className="collection-inner"><div className="collection-copy"><p className="micro-label">Собранная коллекция</p><h2 id="collection-title">Увлажняющий уход</h2><p>Лёгкие слои, щедрые текстуры и более мягкий ритм ежедневной заботы о коже.</p><a className="button button-dark" href="#new-arrivals"><span className="button-arrow" aria-hidden="true">↘</span><span className="button-label">Смотреть коллекцию</span></a></div><div className="collection-visual"><VisualImage label="Композиция увлажняющей коллекции" src="/images/kanso/sets.png" tone="tone-sky" /></div><div className="collection-products">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} wished={wishlist.has(product.id)} added={added.has(product.id)} onWishlist={() => toggleWishlist(product.id, product.name)} onQuickAdd={() => toggleAdded(product.id, product.name)} />)}</div></div>
        </section>

        <section className="section-pad quiz-section" aria-labelledby="quiz-title">
          <div><p className="micro-label">Личная отправная точка</p><h2 id="quiz-title">Найти свой ритуал</h2><p>Ответьте на несколько вопросов и подберите уход для своей кожи.</p></div><button className="button button-dark" type="button" onClick={() => setNotice("Квиз пока находится в демонстрационном состоянии.")}><span className="button-arrow" aria-hidden="true">↘</span><span className="button-label">Пройти квиз</span></button>
        </section>

        <section className="section-pad journal-section" id="journal" aria-labelledby="journal-title">
          <div className="section-heading rail-heading"><div><p className="micro-label">Из журнала</p><h2 id="journal-title">Заметки для тихого ритуала</h2></div><a className="text-link" href="#journal">Весь журнал <span aria-hidden="true">↗</span></a></div>
          <div className="journal-grid">{journalStories.map(([category, title, copy, tone, image]) => <a className="journal-card" href="#journal" key={title}><VisualImage label={title} src={image} tone={tone} /><div className="journal-card-copy"><p className="micro-label">{category}</p><h3>{title}</h3><p>{copy}</p><span className="text-link">Читать статью <span aria-hidden="true">↗</span></span></div></a>)}</div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="footer-top"><div className="footer-brand"><span className="brand-mark">{siteConfig.publicBrandName}</span><p>Продуманная подборка японского ухода, красоты и средств для благополучия.</p></div><div className="footer-column"><p className="micro-label">Покупки</p><a href="#category">Каталог</a><a href="#new-arrivals">Новинки</a><a href="#best-sellers">Хиты продаж</a><a href="#brands">Бренды</a></div><div className="footer-column"><p className="micro-label">Помощь</p><a href="#footer">Доставка</a><a href="#footer">Оплата</a><a href="#footer">Вопросы и ответы</a><a href="#footer">Контакты</a></div><div className="footer-column"><p className="micro-label">О KANSO</p><a href="#footer">О бренде</a><a href="#journal">Журнал</a><a href="#footer">Конфиденциальность</a><a href="#footer">Условия</a></div><div className="footer-column"><p className="micro-label">Мы в сети</p><button type="button" onClick={() => setNotice("Ссылки на социальные сети пока находятся в демонстрационном состоянии.")}>Instagram</button><button type="button" onClick={() => setNotice("Ссылки на социальные сети пока находятся в демонстрационном состоянии.")}>Pinterest</button></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.publicBrandName}</span><span>Предпросмотр каталога · Наличие уточняется</span></div>
      </footer>

      <div className="sr-only" aria-live="polite">{notice}</div>
    </div>
  );
}
