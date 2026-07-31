"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { demoProducts } from "@/data/demo-products";

const CART_KEY = "kanso-cart";

function readCart() {
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export default function CartPage() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => setIds(readCart()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const products = ids.map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean);
  const total = products.reduce((sum, product) => sum + (product?.price ?? 0), 0);

  const remove = (id: string) => {
    const next = ids.filter((item) => item !== id);
    setIds(next);
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  return (
    <main className="cart-page">
      <header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/catalog">Продолжить покупки</Link></header>
      <section className="cart-content" aria-labelledby="cart-title">
        <p className="micro-label">Покупки</p><h1 id="cart-title">Корзина</h1>
        {products.length ? <div className="cart-layout"><div className="cart-list">{products.map((product) => product && <article className="cart-item" key={product.id}><div className="cart-item-image"><Image src={product.image} alt={`${product.brand} — ${product.name}`} fill sizes="96px" /></div><div><p className="product-brand">{product.brand}</p><h2>{product.name}</h2><p>{product.volume}</p><button className="text-link-button" type="button" onClick={() => remove(product.id)}>Удалить</button></div><strong>{new Intl.NumberFormat("ru-RU").format(product.price)} ₽</strong></article>)}</div><aside className="cart-summary"><p>Итого</p><strong>{new Intl.NumberFormat("ru-RU").format(total)} ₽</strong><Link className="button button-dark" href="/checkout">Перейти к оформлению</Link></aside></div> : <div className="cart-empty"><h2>Корзина пока пуста</h2><p>Добавьте понравившиеся средства, чтобы перейти к оформлению.</p><Link className="button button-dark" href="/catalog">Открыть каталог</Link></div>}
      </section>
    </main>
  );
}
