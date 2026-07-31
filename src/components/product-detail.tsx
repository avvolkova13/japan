"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { demoProducts } from "@/data/demo-products";
import type { DemoProduct } from "@/types/product";

const CART_KEY = "kanso-cart";

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export function ProductDetail({ product }: { product: DemoProduct }) {
  const gallery = [product.image, product.hoverImage].filter((image, index, list) => list.indexOf(image) === index);
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [notice, setNotice] = useState("");

  const addToCart = () => {
    let ids: string[] = [];
    try { ids = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]"); } catch { ids = []; }
    if (!ids.includes(product.id)) ids.push(product.id);
    window.localStorage.setItem(CART_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("kanso-cart-change"));
    setAdded(true);
    setNotice(`${product.name} добавлен в корзину.`);
  };

  return (
    <main className="product-page">
      <header className="product-page-header"><Link className="brand-mark" href="/">KANSO</Link><div className="product-page-actions"><Link href="/catalog">Каталог</Link><Link href="/cart">Корзина</Link></div></header>
      <div className="product-breadcrumbs"><Link href="/catalog">Каталог</Link><span aria-hidden="true">/</span><span>{product.category}</span><span aria-hidden="true">/</span><span>{product.brand}</span></div>
      <section className="product-detail-layout" aria-labelledby="product-title">
        <div className="product-gallery">
          <div className="product-gallery-main"><Image src={activeImage} alt={`${product.brand} — ${product.name}`} fill priority sizes="(max-width: 767px) 100vw, 58vw" /></div>
          <div className="product-gallery-thumbs" aria-label="Галерея товара">{gallery.map((image, index) => <button className={activeImage === image ? "is-active" : ""} type="button" key={image} onClick={() => setActiveImage(image)} aria-label={`Изображение ${index + 1}`}><Image src={image} alt="" fill sizes="88px" /></button>)}</div>
        </div>
        <div className="product-detail-copy">
          <p className="micro-label">{product.brand}</p>
          <h1 id="product-title">{product.name}</h1>
          <p className="product-detail-category">{product.category} · {product.volume}</p>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-price">{formatPrice(product.price)}</div>
          <div className="product-option"><span>Объём</span><button className="volume-option is-selected" type="button">{product.volume}</button></div>
          <div className="product-purchase-row"><div className="quantity-control" aria-label="Количество"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Уменьшить количество">−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Увеличить количество">+</button></div><button className="button button-dark product-add-button" type="button" onClick={addToCart}>{added ? "В корзине" : "Добавить в корзину"}</button></div>
          {notice && <p className="form-message" role="status">{notice} <Link href="/cart">Перейти в корзину</Link></p>}
          <div className="product-detail-info"><details open><summary>Описание</summary><p>{product.description}</p></details><details><summary>Характеристики</summary><p>Категория: {product.category}<br />Объём: {product.volume}<br />Наличие: уточняется перед оформлением.</p></details><details><summary>Состав и способ применения</summary><p>Состав и рекомендации по применению указаны на упаковке конкретного средства.</p></details></div>
        </div>
      </section>
      <section className="product-related section-pad-small" aria-labelledby="related-title"><p className="micro-label">Продолжить знакомство</p><h2 id="related-title">Другие средства {product.brand}</h2><div className="product-related-grid">{[...demoProducts.filter((item) => item.brand === product.brand && item.id !== product.id), ...demoProducts.filter((item) => item.id !== product.id)].slice(0, 3).map((item) => <Link className="related-card" href={`/product/${item.id}`} key={item.id}><div><Image src={item.image} alt="" fill sizes="30vw" /></div><p className="product-brand">{item.brand}</p><h3>{item.name}</h3></Link>)}</div></section>
    </main>
  );
}
