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
        {products.length ? <div className="favorites-grid">{products.map((product) => product && <article className="favorite-card" key={product.id}><div className="favorite-card-image"><Link href={`/product/${product.id}`} aria-label={`Открыть ${product.name}`}><Image src={product.image} alt={`${product.brand} — ${product.name}`} fill sizes="(max-width: 767px) 100vw, 30vw" /></Link><button className="wishlist-button is-active" type="button" onClick={() => remove(product.id)} aria-label={`Удалить ${product.name} из избранного`} aria-pressed={true}><svg className="wishlist-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S3.2 15.1 3.2 8.7C3.2 6 5.2 4 7.8 4c1.7 0 3.1.9 4.2 2.2C13.1 4.9 14.5 4 16.2 4c2.6 0 4.6 2 4.6 4.7C20.8 15.1 12 20.2 12 20.2Z" /></svg></button></div><p className="product-brand">{product.brand}</p><h2><Link href={`/product/${product.id}`}>{product.name}</Link></h2><div className="favorite-card-meta"><span>{product.volume}</span><span>{new Intl.NumberFormat("ru-RU").format(product.price)} ₽</span></div></article>)}</div> : <div className="favorites-empty"><h2>В избранном пока ничего нет</h2><p>Сохраняйте понравившиеся средства, чтобы вернуться к ним позже.</p><Link className="button button-dark" href="/catalog">Открыть каталог</Link></div>}
      </section>
    </main>
  );
}
