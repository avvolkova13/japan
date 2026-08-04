"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { demoProducts } from "@/data/demo-products";
import type { DemoProduct } from "@/types/product";
import { CartNavLink } from "@/components/cart-nav-link";

const CART_KEY = "kanso-cart";
const WISHLIST_KEY = "kanso-wishlist";

function readWishlist() {
  try {
    const stored = window.localStorage.getItem(WISHLIST_KEY);
    return new Set<string>(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set<string>();
  }
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export function ProductDetail({ product }: { product: DemoProduct }) {
  const gallery = [...(product.galleryImages ?? [product.image, product.hoverImage])].filter((image, index, list) => list.indexOf(image) === index);
  const galleryViewportRef = useRef<HTMLDivElement>(null);
  const relatedTrackRef = useRef<HTMLDivElement>(null);
  const galleryDragRef = useRef({ active: false, startX: 0, moved: false });
  const relatedDragRef = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const syncWishlist = () => setWished(readWishlist().has(product.id));
    syncWishlist();
    window.addEventListener("storage", syncWishlist);
    window.addEventListener("kanso-wishlist-change", syncWishlist);
    return () => {
      window.removeEventListener("storage", syncWishlist);
      window.removeEventListener("kanso-wishlist-change", syncWishlist);
    };
  }, [product.id]);

  const addToCart = () => {
    let ids: string[] = [];
    try { ids = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]"); } catch { ids = []; }
    ids.push(...Array.from({ length: quantity }, () => product.id));
    window.localStorage.setItem(CART_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("kanso-cart-change"));
    setAdded(true);
    setNotice(`${product.name} добавлен в корзину.`);
  };

  const toggleWishlist = () => {
    const wishlist = readWishlist();
    if (wishlist.has(product.id)) wishlist.delete(product.id);
    else wishlist.add(product.id);
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
    setWished(wishlist.has(product.id));
    window.dispatchEvent(new CustomEvent("kanso-wishlist-change"));
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
      return;
    }

    if (!added) return;

    let ids: string[] = [];
    try { ids = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]"); } catch { ids = []; }
    window.localStorage.setItem(CART_KEY, JSON.stringify(ids.filter((id) => id !== product.id)));
    window.dispatchEvent(new CustomEvent("kanso-cart-change"));
    setAdded(false);
    setNotice(`${product.name} удалён из корзины.`);
  };

  const moveGallery = (direction: -1 | 1) => setActiveSlide((current) => Math.min(Math.max(current + direction, 0), gallery.length - 1));

  const handleGalleryKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); moveGallery(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); moveGallery(1); }
    if (event.key === "Home") { event.preventDefault(); setActiveSlide(0); }
    if (event.key === "End") { event.preventDefault(); setActiveSlide(gallery.length - 1); }
  };

  const handleGalleryWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    moveGallery(event.deltaY > 0 ? 1 : -1);
  };

  const startGalleryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    galleryDragRef.current = { active: true, startX: event.clientX, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveGalleryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = galleryDragRef.current;
    if (!drag.active) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) < 12 || drag.moved) return;
    drag.moved = true;
    moveGallery(distance < 0 ? 1 : -1);
  };

  const finishGalleryDrag = () => { galleryDragRef.current.active = false; };

  const startRelatedDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = relatedTrackRef.current;
    if (!track) return;
    relatedDragRef.current = { active: true, moved: false, startX: event.clientX, startScrollLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
  };

  const moveRelatedDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = relatedDragRef.current;
    const track = relatedTrackRef.current;
    if (!drag.active || !track) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) drag.moved = true;
    track.scrollLeft = drag.startScrollLeft - distance;
  };

  const snapRelatedTrack = () => {
    const track = relatedTrackRef.current;
    const card = track?.querySelector<HTMLElement>(".related-card");
    if (!track || !card) return;
    const gap = Number.parseFloat(window.getComputedStyle(track).gap || "0");
    const step = card.offsetWidth + gap;
    track.scrollTo({ left: Math.round(track.scrollLeft / Math.max(step, 1)) * step, behavior: "smooth" });
  };

  const finishRelatedDrag = () => {
    relatedDragRef.current.active = false;
    snapRelatedTrack();
  };

  const moveRelatedCards = (direction: -1 | 1) => {
    const track = relatedTrackRef.current;
    const card = track?.querySelector<HTMLElement>(".related-card");
    if (!track || !card) return;
    const gap = Number.parseFloat(window.getComputedStyle(track).gap || "0");
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const handleRelatedKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveRelatedCards(event.key === "ArrowRight" ? 1 : -1);
    }
  };

  return (
    <main className="product-page">
      <header className="product-page-header"><Link className="brand-mark" href="/">KANSO</Link><nav className="product-page-actions" aria-label="Покупательская навигация"><Link href="/catalog">Каталог</Link><Link href="/account">Войти</Link><Link href="/favorites">Избранное</Link><CartNavLink /></nav></header>
      <div className="product-breadcrumbs"><Link href="/catalog">Каталог</Link><span aria-hidden="true">/</span><span>{product.category}</span><span aria-hidden="true">/</span><span>{product.brand}</span><span className="product-breadcrumb-index">K-0{product.id.slice(-1)}</span></div>
      <section className="product-detail-layout" aria-labelledby="product-title">
        <div className="product-gallery-shell">
          <nav className="product-gallery-thumbnails" aria-label="Миниатюры товара">
            {gallery.map((image, index) => <button className={index === activeSlide ? "is-active" : ""} type="button" key={image} onClick={() => setActiveSlide(index)} aria-label={`Показать изображение ${index + 1}`} aria-current={index === activeSlide ? "true" : undefined}><Image src={image} alt="" fill sizes="96px" /></button>)}
          </nav>
          <div className="product-gallery-main">
            <div className="product-gallery-viewport" ref={galleryViewportRef} tabIndex={0} onKeyDown={handleGalleryKeyDown} onWheel={handleGalleryWheel} onPointerDown={startGalleryDrag} onPointerMove={moveGalleryDrag} onPointerUp={finishGalleryDrag} onPointerCancel={finishGalleryDrag} role="region" aria-label="Галерея товара">
              <div className="product-gallery-track" style={{ transform: `translate3d(-${activeSlide * 100}%, 0, 0)` }}>
                {gallery.map((image, index) => <figure className={`product-gallery-slide ${image.includes("-cutout") ? "is-cutout" : "is-full-bleed"}`} key={image}><Image src={image} alt={`${product.brand} — ${product.name}, изображение ${index + 1}`} fill priority={index === 0} sizes="(max-width: 767px) 92vw, 54vw" /></figure>)}
              </div>
            </div>
          </div>
        </div>
        <div className="product-info-panel">
          <button className={`product-wishlist-button wishlist-button ${wished ? "is-active" : ""}`} type="button" onClick={toggleWishlist} aria-label={wished ? `Удалить ${product.name} из избранного` : `Добавить ${product.name} в избранное`} aria-pressed={wished}>
            <svg className="wishlist-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" /></svg>
          </button>
          <div className="product-summary-row">
            <div className="product-info-intro"><div className="product-heading-row"><div><p className="micro-label">{product.brand}</p><h1 id="product-title">{product.name}</h1><p className="product-detail-category">{product.category}</p></div><div className="product-detail-price product-detail-price--header">{formatPrice(product.price)}</div></div></div>
            <div className="product-info-purchase"><div className="product-option"><span>Объём</span><button className="volume-option is-selected" type="button" disabled title="Для этого товара доступен один объём">{product.volume}</button></div><div className="product-purchase-row"><div className="quantity-control" aria-label="Количество"><button type="button" onClick={decreaseQuantity} disabled={quantity === 1 && !added} aria-label={quantity === 1 && added ? "Удалить товар из корзины" : "Уменьшить количество"}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Увеличить количество">+</button></div><button className="button button-dark product-add-button" type="button" onClick={addToCart}>{added ? "В корзине" : "Добавить в корзину"}</button></div>{notice && <p className="form-message" role="status">{notice} <Link href="/cart">Перейти в корзину</Link></p>}</div>
          </div>
          <div className="product-detail-pills">
            <details><summary>Описание <span aria-hidden="true">+</span></summary><p>{product.description}</p></details>
            <details><summary>Детали <span aria-hidden="true">+</span></summary><p>Категория: {product.category}<br />Объём: {product.volume}</p></details>
            <details><summary>Состав и способ применения <span aria-hidden="true">+</span></summary><p>Состав и рекомендации по применению указаны на упаковке конкретного средства.</p></details>
            <details><summary>Уход и хранение <span aria-hidden="true">+</span></summary><p>Следуйте рекомендациям на упаковке конкретного средства.</p></details>
          </div>
        </div>
      </section>
      <section className="product-related section-pad-small" aria-labelledby="related-title">
        <div className="product-related-header"><p className="micro-label" id="related-title">Другие предложения</p><span>Прокрутите в сторону</span></div>
        <div className="product-related-track" ref={relatedTrackRef} onPointerDown={startRelatedDrag} onPointerMove={moveRelatedDrag} onPointerUp={finishRelatedDrag} onPointerCancel={finishRelatedDrag} onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.preventDefault(); event.currentTarget.scrollBy({ left: event.deltaY, behavior: "smooth" }); } }} onKeyDown={handleRelatedKeyDown} onClick={(event) => { if (relatedDragRef.current.moved) { event.preventDefault(); relatedDragRef.current.moved = false; } }} role="region" aria-label="Похожие товары" tabIndex={0}>
          {[...demoProducts.filter((item) => item.brand === product.brand && item.id !== product.id), ...demoProducts.filter((item) => item.id !== product.id)].slice(0, 6).map((item) => <Link className="related-card" href={`/product/${item.id}`} key={item.id}><div><Image src={item.image} alt={`${item.brand} — ${item.name}`} fill sizes="(max-width: 767px) 78vw, 34vw" /></div><p className="product-brand">{item.brand}</p><h3>{item.name}</h3><p className="related-card-meta">{item.volume}<span>{formatPrice(item.price)}</span></p></Link>)}
        </div>
        <div className="product-related-controls"><button type="button" onClick={() => moveRelatedCards(-1)} aria-label="Предыдущие похожие товары">←</button><button type="button" onClick={() => moveRelatedCards(1)} aria-label="Следующие похожие товары">→</button></div>
      </section>
    </main>
  );
}
