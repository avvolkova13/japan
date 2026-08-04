"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DemoProduct } from "@/types/product";

const CART_KEY = "kanso-cart";
const WISHLIST_KEY = "kanso-wishlist";

type CatalogCardVariant = "standard" | "feature-left" | "feature-center" | "feature-right" | "small";

function readCart() {
  try {
    const stored = window.localStorage.getItem(CART_KEY);
    return new Set<string>(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set<string>();
  }
}

function readWishlist() {
  try {
    const stored = window.localStorage.getItem(WISHLIST_KEY);
    return new Set<string>(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set<string>();
  }
}

export function CatalogProductCard({ product, variant = "standard" }: { product: DemoProduct; variant?: CatalogCardVariant }) {
  const [inCart, setInCart] = useState(false);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const syncState = () => {
      setInCart(readCart().has(product.id));
      setWished(readWishlist().has(product.id));
    };
    syncState();
    window.addEventListener("storage", syncState);
    window.addEventListener("kanso-cart-change", syncState);
    window.addEventListener("kanso-wishlist-change", syncState);
    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("kanso-cart-change", syncState);
      window.removeEventListener("kanso-wishlist-change", syncState);
    };
  }, [product.id]);

  const toggleCart = () => {
    const cart = readCart();
    if (cart.has(product.id)) cart.delete(product.id);
    else cart.add(product.id);
    window.localStorage.setItem(CART_KEY, JSON.stringify([...cart]));
    setInCart(cart.has(product.id));
    window.dispatchEvent(new CustomEvent("kanso-cart-change"));
  };

  const toggleWishlist = () => {
    const wishlist = readWishlist();
    if (wishlist.has(product.id)) wishlist.delete(product.id);
    else wishlist.add(product.id);
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
    setWished(wishlist.has(product.id));
    window.dispatchEvent(new CustomEvent("kanso-wishlist-change"));
  };

  return (
    <article className={`catalog-product-card catalog-product-card--${variant}`}>
      <div className="catalog-product-media">
        <Link className="catalog-product-image-link" href={`/product/${product.id}`} aria-label={`Открыть ${product.name}`}>
          <Image className="catalog-product-image catalog-product-image-primary" src={product.image} alt={`${product.brand} — ${product.name}`} fill sizes="(max-width: 767px) 50vw, 25vw" />
          <Image className="catalog-product-image catalog-product-image-secondary" src={product.hoverImage} alt="" fill sizes="(max-width: 767px) 50vw, 25vw" aria-hidden="true" />
        </Link>
        <button className={`catalog-wishlist-button wishlist-button ${wished ? "is-active" : ""}`} type="button" onClick={toggleWishlist} aria-label={wished ? `Удалить ${product.name} из избранного` : `Добавить ${product.name} в избранное`} aria-pressed={wished}>
          <svg className="wishlist-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" /></svg>
        </button>
        <button className="catalog-quick-add" type="button" onClick={toggleCart} aria-pressed={inCart}>
          {inCart ? "В корзине" : "В корзину"}
        </button>
      </div>
      <div className="catalog-product-info">
        <h2><Link href={`/product/${product.id}`}>{product.name}</Link></h2>
        <div className="catalog-product-meta"><span>{new Intl.NumberFormat("ru-RU").format(product.price)} ₽</span></div>
      </div>
    </article>
  );
}
