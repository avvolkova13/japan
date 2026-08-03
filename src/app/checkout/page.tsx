"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { demoProducts } from "@/data/demo-products";

const AUTH_KEY = "kanso-auth";
const CART_KEY = "kanso-cart";
const ORDER_KEY = "kanso-last-order";

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export default function CheckoutPage() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [ids, setIds] = useState<string[] | null>(null);
  const [payment, setPayment] = useState("card");
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsSignedIn(Boolean(window.localStorage.getItem(AUTH_KEY)));
      try { setIds(JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]") as string[]); } catch { setIds([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const products = ids?.map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean) ?? [];
  const uniqueProducts = [...new Set(ids ?? [])].map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean);
  const quantityFor = (id: string) => ids?.filter((item) => item === id).length ?? 0;
  const total = uniqueProducts.reduce((sum, product) => sum + (product?.price ?? 0) * quantityFor(product?.id ?? ""), 0);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const orderId = `KANSO-${(ids ?? []).join("").slice(-6).padStart(6, "0")}`;
    window.localStorage.setItem(ORDER_KEY, JSON.stringify({ id: orderId, total, payment, name: form.get("name") }));
    window.localStorage.removeItem(CART_KEY);
    setSubmitted(orderId);
  };

  if (isSignedIn === null || ids === null) return <main className="checkout-page" aria-busy="true"><section className="checkout-content"><p className="micro-label">Оформление</p><p role="status">Проверяем корзину…</p></section></main>;
  if (!isSignedIn) return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/cart">Вернуться в корзину</Link></header><section className="checkout-content"><p className="micro-label">Оформление</p><h1>Войдите, чтобы продолжить</h1><p>Создайте аккаунт или войдите, чтобы оформить заказ.</p><Link className="button button-dark" href="/account">Войти или зарегистрироваться</Link></section></main>;
  if (!products.length) return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/cart">Вернуться в корзину</Link></header><section className="checkout-content"><p className="micro-label">Оформление</p><h1>Корзина пуста</h1><p>Добавьте товар в корзину, чтобы перейти к оформлению.</p><Link className="button button-dark" href="/catalog">Открыть каталог</Link></section></main>;
  if (submitted) return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/catalog">Продолжить покупки</Link></header><section className="checkout-content checkout-success"><p className="micro-label">Заказ создан</p><h1>Спасибо за заказ.</h1><p>Номер заказа: <strong>{submitted}</strong></p><p>Оплата подтверждена. Информация о заказе сохранена в вашем кабинете.</p><Link className="button button-dark" href="/">Вернуться в KANSO</Link></section></main>;

  return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/cart">Вернуться в корзину</Link></header><section className="checkout-content" aria-labelledby="checkout-title"><p className="micro-label">Оформление заказа</p><h1 id="checkout-title">Куда отправить заказ</h1><div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><label>Имя<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Адрес доставки<input name="address" autoComplete="street-address" required /></label><fieldset><legend>Способ оплаты</legend><label className="radio-row"><input type="radio" name="payment" value="card" checked={payment === "card"} onChange={(event) => setPayment(event.target.value)} /> Банковская карта</label><label className="radio-row"><input type="radio" name="payment" value="on-delivery" checked={payment === "on-delivery"} onChange={(event) => setPayment(event.target.value)} /> Оплата при получении</label></fieldset>{payment === "card" && <div className="card-fields"><label>Номер карты<input inputMode="numeric" placeholder="0000 0000 0000 0000" pattern="[0-9 ]{16,19}" required /></label><div><label>Срок действия<input inputMode="numeric" placeholder="MM / YY" pattern="[0-9 /]{4,7}" required /></label><label>CVC<input inputMode="numeric" placeholder="000" pattern="[0-9]{3}" required /></label></div></div>}<button className="button button-dark" type="submit">Оформить заказ</button></form><aside className="checkout-summary"><p className="micro-label">Ваш заказ</p>{uniqueProducts.map((product) => product && <div className="checkout-summary-row" key={product.id}><span>{product.name} × {quantityFor(product.id)}</span><strong>{formatPrice(product.price * quantityFor(product.id))}</strong></div>)}<div className="checkout-total"><span>Итого</span><strong>{formatPrice(total)}</strong></div></aside></div></section></main>;
}
