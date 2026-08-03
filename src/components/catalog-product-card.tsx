"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DemoProduct } from "@/types/product";

const CART_KEY = "kanso-cart";

type CatalogCardVariant = "standard" | "feature-left" | "feature-right" | "small";

function readCart() {
  try {
    const stored = window.localStorage.getItem(CART_KEY);
    return new Set<string>(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set<string>();
  }
}

export function CatalogProductCard({ product, variant = "standard" }: { product: DemoProduct; variant?: CatalogCardVariant }) {
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const syncCartState = () => setInCart(readCart().has(product.id));
    window.addEventListener("storage", syncCartState);
    window.addEventListener("kanso-cart-change", syncCartState);
    return () => {
      window.removeEventListener("storage", syncCartState);
      window.removeEventListener("kanso-cart-change", syncCartState);
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

  return (
    <article className={`catalog-product-card catalog-product-card--${variant}`}>
      <div className="catalog-product-media">
        <Link className="catalog-product-image-link" href={`/product/${product.id}`} aria-label={`Открыть ${product.name}`}>
          <Image className="catalog-product-image catalog-product-image-primary" src={product.image} alt={`${product.brand} — ${product.name}`} fill sizes="(max-width: 767px) 50vw, 25vw" />
          <Image className="catalog-product-image catalog-product-image-secondary" src={product.hoverImage} alt="" fill sizes="(max-width: 767px) 50vw, 25vw" aria-hidden="true" />
        </Link>
        <button className="catalog-quick-add" type="button" onClick={toggleCart} aria-pressed={inCart}>
          {inCart ? "В корзине" : "В корзину"}
        </button>
      </div>
      <p className="product-brand">{product.brand}</p>
      <h2><Link href={`/product/${product.id}`}>{product.name}</Link></h2>
      <div className="catalog-product-meta"><span>{product.volume}</span><span>{new Intl.NumberFormat("ru-RU").format(product.price)} ₽</span></div>
    </article>
  );
}
