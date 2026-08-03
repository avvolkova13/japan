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
  const uniqueProducts = [...new Set(ids)].map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean);
  const quantityFor = (id: string) => ids.filter((item) => item === id).length;
  const total = uniqueProducts.reduce((sum, product) => sum + (product?.price ?? 0) * quantityFor(product?.id ?? ""), 0);

  const remove = (id: string) => {
    const next = ids.filter((item) => item !== id);
    setIds(next);
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  const updateQuantity = (id: string, delta: number) => {
    const current = quantityFor(id);
    const next = delta < 0 && current <= 1 ? ids.filter((item) => item !== id) : delta > 0 ? [...ids, id] : ids.filter((item, index) => item !== id || ids.indexOf(id) !== index);
    setIds(next);
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  return (
    <main className="cart-page">
      <header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/catalog">Продолжить покупки</Link></header>
      <section className="cart-content" aria-labelledby="cart-title">
        <p className="micro-label">Покупки</p><h1 id="cart-title">Корзина</h1>
        {products.length ? <div className="cart-layout"><div className="cart-list">{uniqueProducts.map((product) => product && <article className="cart-item" key={product.id}><div className="cart-item-image"><Image src={product.image} alt={`${product.brand} — ${product.name}`} fill sizes="96px" /></div><div><p className="product-brand">{product.brand}</p><h2>{product.name}</h2><p>{product.volume}</p><div className="cart-item-actions"><div className="quantity-control" aria-label={`Количество: ${product.name}`}><button type="button" onClick={() => updateQuantity(product.id, -1)} aria-label={`Уменьшить количество: ${product.name}`}>−</button><span>{quantityFor(product.id)}</span><button type="button" onClick={() => updateQuantity(product.id, 1)} aria-label={`Увеличить количество: ${product.name}`}>+</button></div><button className="text-link-button" type="button" onClick={() => remove(product.id)}>Удалить</button></div></div><strong>{new Intl.NumberFormat("ru-RU").format(product.price * quantityFor(product.id))} ₽</strong></article>)}</div><aside className="cart-summary"><p>Итого</p><strong>{new Intl.NumberFormat("ru-RU").format(total)} ₽</strong><Link className="button button-dark" href="/checkout">Перейти к оформлению</Link></aside></div> : <div className="cart-empty"><h2>Корзина пока пуста</h2><p>Добавьте понравившиеся средства, чтобы перейти к оформлению.</p><Link className="button button-dark" href="/catalog">Открыть каталог</Link></div>}
      </section>
    </main>
  );
}
