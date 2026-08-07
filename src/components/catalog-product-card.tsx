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
          <svg className="wishlist-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S3.2 15.1 3.2 8.7C3.2 6 5.2 4 7.8 4c1.7 0 3.1.9 4.2 2.2C13.1 4.9 14.5 4 16.2 4c2.6 0 4.6 2 4.6 4.7C20.8 15.1 12 20.2 12 20.2Z" /></svg>
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
