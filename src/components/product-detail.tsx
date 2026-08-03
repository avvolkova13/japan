"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { demoProducts } from "@/data/demo-products";
import type { DemoProduct } from "@/types/product";

const CART_KEY = "kanso-cart";

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export function ProductDetail({ product }: { product: DemoProduct }) {
  const gallery = [...(product.galleryImages ?? [product.image, product.hoverImage])].filter((image, index, list) => list.indexOf(image) === index);
  const galleryStageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const relatedTrackRef = useRef<HTMLDivElement>(null);
  const relatedDragRef = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const [galleryPhase, setGalleryPhase] = useState<"before" | "pinned" | "complete">("before");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [notice, setNotice] = useState("");

  const addToCart = () => {
    let ids: string[] = [];
    try { ids = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]"); } catch { ids = []; }
    ids.push(...Array.from({ length: quantity }, () => product.id));
    window.localStorage.setItem(CART_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("kanso-cart-change"));
    setAdded(true);
    setNotice(`${product.name} добавлен в корзину.`);
  };

  useEffect(() => {
    const stage = galleryStageRef.current;
    const track = galleryRef.current;
    if (!stage || !track) return;

    const updateActiveSlide = () => {
      const slideWidth = track.firstElementChild?.getBoundingClientRect().width ?? track.clientWidth;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || "0");
      const nextSlide = Math.round(track.scrollLeft / Math.max(slideWidth + gap, 1));
      setActiveSlide(Math.min(Math.max(nextSlide, 0), gallery.length - 1));
    };

    track.addEventListener("scroll", updateActiveSlide, { passive: true });

    const syncGalleryToPageScroll = () => {
      const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      const scrollRange = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max((window.scrollY - stageTop) / scrollRange, 0), 1);
      track.scrollLeft = maxScroll * progress;
      const nextPhase = window.scrollY < stageTop ? "before" : window.scrollY <= stageTop + scrollRange ? "pinned" : "complete";
      setGalleryPhase((current) => current === nextPhase ? current : nextPhase);
    };

    window.addEventListener("scroll", syncGalleryToPageScroll, { passive: true });
    window.addEventListener("resize", syncGalleryToPageScroll);
    syncGalleryToPageScroll();

    return () => {
      track.removeEventListener("scroll", updateActiveSlide);
      window.removeEventListener("scroll", syncGalleryToPageScroll);
      window.removeEventListener("resize", syncGalleryToPageScroll);
    };
  }, [gallery.length]);

  const moveGallery = (direction: -1 | 1) => {
    galleryRef.current?.scrollBy({ left: direction * (galleryRef.current.clientWidth * 0.78), behavior: "smooth" });
  };

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

  return (
    <main className="product-page">
      <header className="product-page-header"><Link className="brand-mark" href="/">KANSO</Link><div className="product-page-actions"><Link href="/catalog">Каталог</Link><Link href="/cart">Корзина</Link></div></header>
      <div className="product-breadcrumbs"><Link href="/catalog">Каталог</Link><span aria-hidden="true">/</span><span>{product.category}</span><span aria-hidden="true">/</span><span>{product.brand}</span><span className="product-breadcrumb-index">K-0{product.id.slice(-1)}</span></div>
      <section className="product-detail-layout" aria-labelledby="product-title">
        <div className="product-gallery-scroll-stage" ref={galleryStageRef} style={{ "--gallery-steps": gallery.length } as CSSProperties}>
          <div className={`product-gallery is-scroll-${galleryPhase}`}>
            <div className="product-gallery-heading"><span>Изделие / {product.category}</span><span>{String(activeSlide + 1).padStart(2, "0")} — {String(gallery.length).padStart(2, "0")}</span></div>
            <div className="product-gallery-track" ref={galleryRef} aria-label="Галерея товара">
              {gallery.map((image, index) => (
                <figure className={`product-gallery-slide ${image.includes("-cutout") ? "is-cutout" : "is-full-bleed"}`} key={image}>
                  <Image src={image} alt={`${product.brand} — ${product.name}, изображение ${index + 1}`} fill priority={index === 0} sizes="(max-width: 767px) 88vw, 74vw" />
                  <figcaption><span>{String(index + 1).padStart(2, "0")}</span><span>{product.brand}</span></figcaption>
                </figure>
              ))}
            </div>
            <div className="product-gallery-controls">
              <div className="product-gallery-scrollbar" aria-hidden="true"><span style={{ width: `${100 / gallery.length}%`, transform: `translateX(${activeSlide * 100}%)` }} /></div>
              <div className="product-gallery-buttons"><button type="button" onClick={() => moveGallery(-1)} disabled={activeSlide === 0} aria-label="Предыдущее изображение">←</button><button type="button" onClick={() => moveGallery(1)} disabled={activeSlide === gallery.length - 1} aria-label="Следующее изображение">→</button></div>
            </div>
          </div>
        </div>
        <div className="product-info-panel">
          <div className="product-summary-row">
            <div className="product-info-intro"><p className="micro-label">{product.brand}</p><h1 id="product-title">{product.name}</h1><p className="product-detail-category">{product.category} · {product.volume}</p></div>
            <div className="product-info-purchase"><div className="product-detail-price">{formatPrice(product.price)}</div><div className="product-option"><span>Объём</span><button className="volume-option is-selected" type="button" disabled title="Для этого товара доступен один объём">{product.volume}</button></div><div className="product-purchase-row"><div className="quantity-control" aria-label="Количество"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Уменьшить количество">−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Увеличить количество">+</button></div><button className="button button-dark product-add-button" type="button" onClick={addToCart}>{added ? "В корзине" : "Добавить в корзину"}</button></div>{notice && <p className="form-message" role="status">{notice} <Link href="/cart">Перейти в корзину</Link></p>}</div>
          </div>
          <div className="product-detail-card">
            <div className="product-detail-copy"><p className="product-detail-kicker">Описание</p><p className="product-detail-description">{product.description}</p><p className="product-detail-reference">{product.category} · {product.volume}</p></div>
            <div className="product-detail-facts"><p className="product-detail-kicker">Детали</p><ul><li>Категория: {product.category}</li><li>Объём: {product.volume}</li></ul></div>
          </div>
          <div className="product-detail-pills"><details><summary>Состав и способ применения <span aria-hidden="true">+</span></summary><p>Состав и рекомендации по применению указаны на упаковке конкретного средства.</p></details><details><summary>Уход и хранение <span aria-hidden="true">+</span></summary><p>Следуйте рекомендациям на упаковке конкретного средства.</p></details></div>
        </div>
      </section>
      <aside className="product-ritual-rail" aria-label="О KANSO"><span>Японская эстетика</span><span>Точный уход</span><span>Каталог KANSO / 2026</span></aside>
      <section className="product-related section-pad-small" aria-labelledby="related-title">
        <div className="product-related-header"><p className="micro-label" id="related-title">Другие предложения</p><span>Прокрутите в сторону</span></div>
        <div className="product-related-track" ref={relatedTrackRef} onPointerDown={startRelatedDrag} onPointerMove={moveRelatedDrag} onPointerUp={finishRelatedDrag} onPointerCancel={finishRelatedDrag} onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.preventDefault(); event.currentTarget.scrollBy({ left: event.deltaY, behavior: "smooth" }); } }} onClick={(event) => { if (relatedDragRef.current.moved) { event.preventDefault(); relatedDragRef.current.moved = false; } }} role="region" aria-label="Похожие товары">
          {[...demoProducts.filter((item) => item.brand === product.brand && item.id !== product.id), ...demoProducts.filter((item) => item.id !== product.id)].slice(0, 6).map((item) => <Link className="related-card" href={`/product/${item.id}`} key={item.id}><div><Image src={item.image} alt={`${item.brand} — ${item.name}`} fill sizes="(max-width: 767px) 78vw, 34vw" /></div><p className="product-brand">{item.brand}</p><h3>{item.name}</h3><p className="related-card-meta">{item.volume}<span>{formatPrice(item.price)}</span></p></Link>)}
        </div>
        <div className="product-related-controls"><button type="button" onClick={() => moveRelatedCards(-1)} aria-label="Предыдущие похожие товары">←</button><button type="button" onClick={() => moveRelatedCards(1)} aria-label="Следующие похожие товары">→</button></div>
      </section>
    </main>
  );
}
