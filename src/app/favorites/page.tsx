"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { demoProducts } from "@/data/demo-products";

const WISHLIST_KEY = "kanso-wishlist";

function readWishlist() {
  try {
    return JSON.parse(window.localStorage.getItem(WISHLIST_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export default function FavoritesPage() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(readWishlist());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("kanso-wishlist-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("kanso-wishlist-change", sync);
    };
  }, []);

  const products = ids.map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean);
  const remove = (id: string) => {
    const next = ids.filter((item) => item !== id);
    setIds(next);
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("kanso-wishlist-change"));
  };

  return (
    <main className="favorites-page">
      <header className="favorites-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/catalog">Продолжить покупки</Link></header>
      <section className="favorites-content" aria-labelledby="favorites-title">
        <h1 id="favorites-title">Избранное</h1>
        {products.length ? <div className="favorites-grid">{products.map((product) => product && <article className="favorite-card" key={product.id}><div className="favorite-card-image"><Link href={`/product/${product.id}`} aria-label={`Открыть ${product.name}`}><Image src={product.image} alt={`${product.brand} — ${product.name}`} fill sizes="(max-width: 767px) 100vw, 30vw" /></Link><button type="button" onClick={() => remove(product.id)} aria-label={`Удалить ${product.name} из избранного`}>♡</button></div><p className="product-brand">{product.brand}</p><h2><Link href={`/product/${product.id}`}>{product.name}</Link></h2><div className="favorite-card-meta"><span>{product.volume}</span><span>{new Intl.NumberFormat("ru-RU").format(product.price)} ₽</span></div></article>)}</div> : <div className="favorites-empty"><h2>В избранном пока ничего нет</h2><p>Сохраняйте понравившиеся средства, чтобы вернуться к ним позже.</p><Link className="button button-dark" href="/catalog">Открыть каталог</Link></div>}
      </section>
    </main>
  );
}
