"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { demoProducts } from "@/data/demo-products";
import { siteConfig } from "@/config/site";
import { CartNavLink } from "@/components/cart-nav-link";
import { EditorialVideoScroll } from "@/components/editorial-video-scroll";

const brands = [...new Set(demoProducts.map((product) => product.brand))];

const categories = [
  ["Face", "Продуманный уход для кожи каждый день.", "tone-pearl", "/images/kanso/face.png"],
  ["Hair", "Уход за блеском, мягкостью и ритуалом.", "tone-blue", "/images/kanso/hair.png"],
  ["Body", "Небольшие жесты заботы, выбранные осознанно.", "tone-stone", "/images/kanso/body.png"],
  ["Sun Care", "Лёгкие текстуры для ежедневной защиты.", "tone-sky", "/images/kanso/sun-care.png"],
  ["Wellness", "Простые средства для более мягкого ритма.", "tone-pearl-deep", "/images/kanso/wellness.png"],
  ["Sets", "Собранные ритуалы, готовые стать подарком.", "tone-blue-soft", "/images/kanso/sets-category.png"],
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
  ["РИТУАЛЫ", "Как выстроить простой японский уход", "Спокойная отправная точка для продуманной ежедневной рутины.", "tone-pearl", "/images/kanso/philosophy-mirror.png", "japanese-approach"],
  ["ТЕКСТУРЫ", "Солнцезащита каждый день: как выбрать текстуру", "О том, как найти комфортное покрытие для ежедневного ухода.", "tone-sky", "/images/kanso/philosophy-texture.png", "sun-care-textures"],
  ["УТРО", "Пять тихих ритуалов красоты для насыщенного утра", "Небольшие жесты, которые делают привычное утро более осознанным.", "tone-stone", "/images/kanso/philosophy-morning.png", "quiet-morning-rituals"],
] as const;

const newArrivals = demoProducts.filter((product) => product.id.startsWith("new-"));
const bestSellerIds = [
  "best-01",
  "best-02",
  "best-03",
  "best-04",
  "best-05",
  "face-01",
  "face-02",
  "hair-01",
  "hair-02",
  "body-01",
];
const bestSellers = bestSellerIds.flatMap((id) => {
  const product = demoProducts.find((item) => item.id === id);
  return product ? [product] : [];
});
const featuredProducts = demoProducts.filter((product) => ["new-01", "best-02", "best-04"].includes(product.id));
const WISHLIST_KEY = "kanso-wishlist";

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

function VisualImage({
  label,
  src,
  tone = "tone-pearl",
  className = "",
  secondary = false,
  priority = false,
  sizes = "(max-width: 767px) 100vw, 50vw",
}: {
  label: string;
  src: string;
  tone?: string;
  className?: string;
  secondary?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={`visual-placeholder visual-image ${tone} ${secondary ? "visual-placeholder-secondary" : ""} ${className}`}
    >
      <Image src={src} alt={label} fill priority={priority} sizes={sizes} />
    </div>
  );
}

function QuizPinnedScene() {
  return (
    <div className="quiz-pinned-scene">
      <div className="quiz-side-track quiz-side-track-left" aria-hidden="true">
        <div className="quiz-side-pin-range">
          <div className="quiz-side-image-sticky">
            <VisualImage className="quiz-side-image" label="" src="/images/kanso/quiz-profile.png" tone="tone-pearl" sizes="(max-width: 767px) 1px, (max-width: 1024px) 24vw, 17vw" />
          </div>
        </div>
      </div>

      <div className="quiz-center-track">
        <div className="quiz-center-pin-range">
          <div className="quiz-center-composition">
            <VisualImage className="quiz-image-center" label="Портрет для подбора личного ритуала" src="/images/kanso/ritual-portrait.png" tone="tone-pearl" sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1024px) 42vw, 34vw" />
            <div className="quiz-copy">
              <h2 id="quiz-title">Найти свой ритуал</h2>
              <p>Ответьте на вопросы и подберите уход для кожи.</p>
              <Link className="button button-dark" href="/ritual">
                <span className="button-arrow" aria-hidden="true"><svg className="button-arrow-icon" viewBox="0 0 20 20" fill="none" focusable="false"><path d="M3.67242 12.9971V2.5H4.67242V11.9971H15.7824L15.6133 11.9455L12.4346 8.69261L13.1494 7.99339L17.209 12.1477L17.5508 12.4973L17.209 12.8469L13.1494 17.0012L12.4346 16.302L15.6162 13.0452L15.7753 12.9971H3.67242Z" fill="currentColor" /></svg></span>
                <span className="button-label">Пройти квиз</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-side-track quiz-side-track-right" aria-hidden="true">
        <div className="quiz-side-pin-range">
          <div className="quiz-side-image-sticky">
            <VisualImage className="quiz-side-image" label="" src="/images/kanso/quiz-ritual.png" tone="tone-stone" sizes="(max-width: 767px) 1px, (max-width: 1024px) 24vw, 17vw" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhilosophyCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideStep, setSlideStep] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const storyCount = journalStories.length;
  const activeStory = journalStories[activeIndex];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const slides = track.querySelectorAll<HTMLElement>(".philosophy-slide");
      if (slides.length < 2) return;
      setSlideStep(slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track.parentElement ?? track);
    return () => observer.disconnect();
  }, []);

  const move = (nextDirection: 1 | -1) => {
    setActiveIndex((current) => Math.min(storyCount - 1, Math.max(0, current + nextDirection)));
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  };

  return (
    <section className="philosophy-section" id="journal" aria-labelledby="journal-title">
      <div className="philosophy-heading">
        <h2 id="journal-title">Философия KANSO</h2>
        <span aria-hidden="true">{String(activeIndex + 1).padStart(2, "0")} / {String(storyCount).padStart(2, "0")}</span>
      </div>

      <div
        className="philosophy-carousel"
        role="region"
        aria-roledescription="карусель"
        aria-label="Материалы журнала KANSO"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="philosophy-viewport">
          <div
            className="philosophy-track"
            ref={trackRef}
            style={{ transform: `translate3d(${-activeIndex * slideStep}px, 0, 0)` }}
          >
            {journalStories.map(([category, title, copy, tone, image, slug], index) => (
              <article className="philosophy-slide" aria-hidden={index !== activeIndex} key={slug}>
                <div className="philosophy-image-card">
                  <VisualImage label={title} src={image} tone={tone} sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1024px) 46vw, 31vw" />
                </div>
                <div className="philosophy-copy-card">
                  <p className="philosophy-eyebrow"><span aria-hidden="true" />{category}</p>
                  <div className="philosophy-copy-main">
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                  <Link className="philosophy-link" href={`/journal/${slug}`} tabIndex={index === activeIndex ? 0 : -1}>
                    <span aria-hidden="true">↳</span>
                    Читать статью
                  </Link>
                </div>
              </article>
            ))}
            <div className="philosophy-trailing-image" aria-hidden="true">
              <VisualImage label="" src="/images/kanso/philosophy-ending.png" tone="tone-pearl" sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1024px) 45vw, 31vw" />
            </div>
          </div>

          <div className="philosophy-controls">
            <button className="philosophy-arrow philosophy-arrow--left" type="button" onClick={() => move(-1)} aria-label="Предыдущий материал" disabled={activeIndex === 0}>
              <span aria-hidden="true">←</span>
            </button>
            <button className="philosophy-arrow philosophy-arrow--right" type="button" onClick={() => move(1)} aria-label="Следующий материал" disabled={activeIndex === storyCount - 1}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <span className="sr-only" aria-live="polite">{activeStory[1]}</span>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  wished,
  added,
  onWishlist,
  onQuickAdd,
  imageSizes,
}: {
  product: (typeof demoProducts)[number];
  wished: boolean;
  added: boolean;
  onWishlist: () => void;
  onQuickAdd: () => void;
  imageSizes: string;
}) {
  return (
    <article className="product-card">
      <div className="product-media">
        <Link className="product-card-image-link" href={`/product/${product.id}`} aria-label={`Открыть ${product.name}`}><VisualImage label={`${product.brand} ${product.name}`} src={product.image} tone="tone-product" sizes={imageSizes} /><VisualImage label={`${product.brand} ${product.name}, альтернативный вид`} src={product.hoverImage} tone="tone-product-alt" secondary sizes={imageSizes} /></Link>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`icon-button wishlist-button ${wished ? "is-active" : ""}`}
          type="button"
          aria-label={wished ? `Убрать ${product.name} из избранного` : `Добавить ${product.name} в избранное`}
          aria-pressed={wished}
          onClick={onWishlist}
        >
          <svg className="wishlist-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 20.2S3.2 15.1 3.2 8.7C3.2 6 5.2 4 7.8 4c1.7 0 3.1.9 4.2 2.2C13.1 4.9 14.5 4 16.2 4c2.6 0 4.6 2 4.6 4.7C20.8 15.1 12 20.2 12 20.2Z" />
          </svg>
        </button>
        <button className="quick-add" type="button" onClick={onQuickAdd}>
          {added ? "В корзине" : "В корзину"}
        </button>
      </div>
      <div className="product-meta">
        <h3><Link href={`/product/${product.id}`}>{product.name}</Link></h3>
        <span className="product-price">{formatPrice(product.price)}</span>
      </div>
    </article>
  );
}

export function HomePage() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountSignedIn, setAccountSignedIn] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState("");
  const bestRailRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => setAccountSignedIn(Boolean(window.localStorage.getItem("kanso-auth"))), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setWishlist(new Set<string>(JSON.parse(window.localStorage.getItem(WISHLIST_KEY) ?? "[]")));
      } catch {
        setWishlist(new Set());
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const link = document.querySelector<HTMLAnchorElement>("#new-arrivals .section-cta a");
    link?.setAttribute("href", "/catalog?new=true");
  }, []);

  useEffect(() => {
    const link = document.querySelector<HTMLAnchorElement>("[aria-labelledby=\"collection-title\"] .collection-copy .button");
    link?.setAttribute("href", "/catalog?focus=hydration");
  }, []);

  useEffect(() => {
    const button = document.querySelector<HTMLButtonElement>(".quiz-section button");
    if (!button) return;
    const label = button.querySelector<HTMLElement>(".button-label");
    if (label) label.textContent = "Подобрать уход";
    const openRitual = () => window.location.assign("/ritual");
    button.addEventListener("click", openRitual);
    return () => button.removeEventListener("click", openRitual);
  }, []);

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
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new CustomEvent("kanso-wishlist-change"));
      return next;
    });
  };

  const toggleAdded = (id: string, name: string) => {
    setAdded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
        setNotice(`${name} удалён из корзины.`);
      } else {
        next.add(id);
        setNotice(`${name} добавлен в корзину.`);
      }
      return next;
    });
    let cart: string[] = [];
    try { cart = JSON.parse(window.localStorage.getItem("kanso-cart") ?? "[]") as string[]; } catch { cart = []; }
    const nextCart = cart.includes(id) ? cart.filter((item) => item !== id) : [...cart, id];
    window.localStorage.setItem("kanso-cart", JSON.stringify(nextCart));
    window.dispatchEvent(new CustomEvent("kanso-cart-change"));
  };

  const getBestSellerStep = () => {
    const rail = bestRailRef.current;
    const card = rail?.querySelector<HTMLElement>(".product-card");
    if (!rail || !card) return 360;
    const gap = Number.parseFloat(window.getComputedStyle(rail).gap || "0");
    return card.offsetWidth + gap;
  };

  const snapBestSellers = () => {
    const rail = bestRailRef.current;
    if (!rail) return;
    const step = getBestSellerStep();
    rail.scrollTo({ left: Math.round(rail.scrollLeft / Math.max(step, 1)) * step, behavior: "smooth" });
  };

  const scrollBestSellers = (direction: number) => {
    bestRailRef.current?.scrollBy({ left: direction * getBestSellerStep(), behavior: "smooth" });
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
    snapBestSellers();
  };

  const handleBestRailWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    event.currentTarget.scrollBy({ left: event.deltaY, behavior: "smooth" });
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="page-load-grid" aria-hidden="true">
        {Array.from({ length: 4 }, (_, rowIndex) => (
          <div className="page-load-row" key={`load-row-${rowIndex}`}>
            {Array.from({ length: 16 }, (_, blockIndex) => (
              <span className="page-load-block" key={`load-block-${rowIndex}-${blockIndex}`} style={{ animationDelay: `${(rowIndex % 2 === 0 ? 15 - blockIndex : blockIndex) * 33.333}ms` }} />
            ))}
          </div>
        ))}
      </div>
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
            <Link className="utility-link desktop-only header-login-link" href="/account">{accountSignedIn ? "Кабинет" : "Войти"}</Link>
            <Link className="utility-link responsive-utility wishlist-nav" href="/favorites">Избранное</Link>
            <CartNavLink className="utility-link responsive-utility cart-nav" />
            <button className="menu-trigger" type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}>
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
                  <Link key={category} href={`/catalog?category=${encodeURIComponent(category)}`} onClick={() => setCatalogOpen(false)}>{categoryLabels[category]}<span aria-hidden="true">↗</span></Link>
                ))}
              </div>
            </div>
          </div>
        )}
        {searchOpen && (
          <div className="search-panel" role="search">
            <div className="search-panel-inner">
              <label htmlFor="kanso-search">Поиск по KANSO</label>
              <input id="kanso-search" type="search" value={searchQuery} placeholder="Название или бренд" onChange={(event) => setSearchQuery(event.target.value)} />
              {searchQuery.trim() && <div className="search-results" aria-live="polite">
                {demoProducts.filter((product) => `${product.brand} ${product.name}`.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 5).map((product) => <Link key={product.id} href={`/product/${product.id}`} onClick={() => setSearchOpen(false)}><span>{product.name}</span><small>{product.brand}</small></Link>)}
                {!demoProducts.some((product) => `${product.brand} ${product.name}`.toLowerCase().includes(searchQuery.trim().toLowerCase())) && <p>Ничего не найдено</p>}
              </div>}
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="hero hero-motion section-pad" aria-labelledby="hero-title">
          <div className="hero-motion-background" aria-hidden="true" />
          <div className="hero-motion-copy">
            <h1 id="hero-title"><span>Тихий ритуал</span><span>для кожи</span></h1>
            <div className="hero-motion-footer">
              <p className="hero-description">Японская косметика, средства<br />для здоровья и бьюти-ритуалы<br />для современного ритма жизни.</p>
            <Link className="button button-dark" href="/catalog"><span className="button-arrow" aria-hidden="true"><svg className="button-arrow-icon" viewBox="0 0 20 20" fill="none" focusable="false"><path d="M3.67242 12.9971V2.5H4.67242V11.9971H15.7824L15.6133 11.9455L12.4346 8.69261L13.1494 7.99339L17.209 12.1477L17.5508 12.4973L17.209 12.8469L13.1494 16.302L15.6162 13.0452L15.7753 12.9971H3.67242Z" fill="currentColor" /></svg></span><span className="button-label">В каталог</span></Link>
            </div>
          </div>
          <div className="hero-product-stage">
            <VisualImage className="hero-product-image" label="Премиальный очищающий флюид KANSO" src="/images/kanso/kanso-pump-open-premium.png" tone="tone-hero" priority sizes="(max-width: 767px) 64vw, (max-width: 1024px) 64vw, 70vw" />
          </div>
        </section>

        <section className="brand-rail section-pad-small" id="brands" aria-label="Избранные бренды">
          <p className="micro-label">Продуманная подборка</p>
          <div className="brand-list">{brands.map((brand) => <a className="brand-list-link" key={brand} href={`/catalog?brand=${encodeURIComponent(brand)}`}>{brand}</a>)}</div>
        </section>

        <section className="section-pad category-section" id="category" aria-labelledby="category-title">
          <div className="section-heading">
            <h2 id="category-title">Выбрать категорию</h2>
          </div>
          <div className="category-grid">
            {categories.map(([category, copy, tone, image]) => (
              <a className="category-card" href={`/catalog?category=${encodeURIComponent(category)}`} key={category}>
                <VisualImage label={`Категория: ${categoryLabels[category]}`} src={image} tone={tone} sizes="(max-width: 767px) 50vw, 33vw" />
                <div className="category-card-copy"><div><h3>{categoryLabels[category]}</h3><p>{copy}</p></div><span className="round-arrow" aria-hidden="true">↗</span></div>
              </a>
            ))}
          </div>
        </section>

        <section className="section-pad new-arrivals-section" id="new-arrivals" aria-labelledby="new-arrivals-title">
          <div className="section-heading split-heading">
            <div>
              <h2 className="new-arrivals-title" id="new-arrivals-title">Новинки для неё</h2>
            </div>
            <p className="new-arrivals-subtitle">Новые позиции в подборке KANSO.</p>
          </div>
          <div className="new-arrivals-layout">
            <div className="editorial-visual"><VisualImage label="Редакционная композиция новинок" src="/images/kanso/collection.png" tone="tone-blue" sizes="(max-width: 767px) 100vw, (max-width: 1024px) 35vw, 36vw" /><p className="image-note">Более мягкое начало сезона.</p></div>
            <div className="product-grid new-arrivals-grid">
              {newArrivals.map((product) => <ProductCard key={product.id} product={product} wished={wishlist.has(product.id)} added={added.has(product.id)} onWishlist={() => toggleWishlist(product.id, product.name)} onQuickAdd={() => toggleAdded(product.id, product.name)} imageSizes="(max-width: 767px) 50vw, (max-width: 1024px) 32vw, 20vw" />)}
            </div>
            <div className="section-cta"><a className="button button-dark" href="#new-arrivals"><span className="button-arrow" aria-hidden="true"><svg className="button-arrow-icon" viewBox="0 0 20 20" fill="none" focusable="false"><path d="M3.67242 12.9971V2.5H4.67242V11.9971H15.7824L15.6133 11.9455L12.4346 8.69261L13.1494 7.99339L17.209 12.1477L17.5508 12.4973L17.209 12.8469L13.1494 17.0012L12.4346 16.302L15.6162 13.0452L15.7753 12.9971H3.67242Z" fill="currentColor" /></svg></span><span className="button-label">Все новинки</span></a></div>
          </div>
        </section>

        <EditorialVideoScroll />

        <section className="section-pad best-sellers-section" id="best-sellers" aria-labelledby="best-sellers-title">
          <div className="section-heading rail-heading"><div><h2 id="best-sellers-title">Хиты продаж</h2></div><div className="rail-controls"><button className="round-arrow control-button" type="button" onClick={() => scrollBestSellers(-1)} aria-label="Предыдущие хиты продаж">←</button><button className="round-arrow control-button" type="button" onClick={() => scrollBestSellers(1)} aria-label="Следующие хиты продаж">→</button></div></div>
          <div className="product-rail" ref={bestRailRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onWheel={handleBestRailWheel}>
            {bestSellers.map((product) => <ProductCard key={product.id} product={product} wished={wishlist.has(product.id)} added={added.has(product.id)} onWishlist={() => toggleWishlist(product.id, product.name)} onQuickAdd={() => toggleAdded(product.id, product.name)} imageSizes="(max-width: 767px) 72vw, (max-width: 1024px) 34vw, 260px" />)}
          </div>
        </section>

        <section className="quiz-section" aria-labelledby="quiz-title">
          <QuizPinnedScene />
        </section>

        <section className="collection-section section-pad" aria-labelledby="collection-title">
          <div className="collection-inner"><div className="collection-copy"><h2 id="collection-title"><span>Увлажняющий</span><span>уход</span></h2><p>Лёгкие слои, щедрые текстуры и более мягкий ритм ежедневной заботы о коже.</p><a className="button button-dark" href="#new-arrivals"><span className="button-arrow" aria-hidden="true"><svg className="button-arrow-icon" viewBox="0 0 20 20" fill="none" focusable="false"><path d="M3.67242 12.9971V2.5H4.67242V11.9971H15.7824L15.6133 11.9455L12.4346 8.69261L13.1494 7.99339L17.209 12.1477L17.5508 12.4973L17.209 12.8469L13.1494 17.0012L12.4346 16.302L15.6162 13.0452L15.7753 12.9971H3.67242Z" fill="currentColor" /></svg></span><span className="button-label">Смотреть коллекцию</span></a></div><div className="collection-visual"><VisualImage label="Композиция увлажняющей коллекции" src="/images/kanso/sets.png" tone="tone-sky" sizes="(max-width: 767px) 100vw, (max-width: 1024px) 100vw, 30vw" /></div><div className="collection-products">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} wished={wishlist.has(product.id)} added={added.has(product.id)} onWishlist={() => toggleWishlist(product.id, product.name)} onQuickAdd={() => toggleAdded(product.id, product.name)} imageSizes="(max-width: 767px) 33vw, (max-width: 1024px) 100vw, 14vw" />)}</div></div>
        </section>

        <PhilosophyCarousel />
      </main>

      <footer className="site-footer" id="footer">
        <div className="footer-top"><div className="footer-brand"><span className="brand-mark">{siteConfig.publicBrandName}</span><p>Продуманная подборка японского ухода, красоты и средств для благополучия.</p></div><div className="footer-column"><p className="micro-label">Покупки</p><Link href="/catalog">Каталог</Link><a href="#new-arrivals">Новинки</a><a href="#best-sellers">Хиты продаж</a><a href="#brands">Бренды</a></div><div className="footer-column"><p className="micro-label">Помощь</p><Link href="/delivery">Доставка</Link><Link href="/payment">Оплата</Link><Link href="/faq">Вопросы и ответы</Link><Link href="/contacts">Контакты</Link></div><div className="footer-column"><p className="micro-label">О KANSO</p><Link href="/about">О бренде</Link><Link href="/journal">Журнал</Link><Link href="/privacy">Конфиденциальность</Link><Link href="/terms">Условия</Link></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.publicBrandName}</span></div>
      </footer>

      <div className="sr-only" aria-live="polite">{notice}</div>
    </div>
  );
}
