"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { demoProducts } from "@/data/demo-products";

const AUTH_KEY = "kanso-auth";
const CART_KEY = "kanso-cart";
const ORDER_KEY = "kanso-last-order";
const ORDERS_KEY = "kanso-orders";

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export default function CheckoutPage() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [ids, setIds] = useState<string[] | null>(null);
  const [payment, setPayment] = useState("card");
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    window.queueMicrotask(() => {
      if (cancelled) return;
      try {
        const storedIds: unknown = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]");
        setIsSignedIn(Boolean(window.localStorage.getItem(AUTH_KEY)));
        setIds(Array.isArray(storedIds) ? storedIds.filter((id): id is string => typeof id === "string") : []);
      } catch {
        setIsSignedIn(false);
        setIds([]);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const products = ids?.map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean) ?? [];
  const uniqueProducts = [...new Set(ids ?? [])].map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean);
  const quantityFor = (id: string) => ids?.filter((item) => item === id).length ?? 0;
  const total = uniqueProducts.reduce((sum, product) => sum + (product?.price ?? 0) * quantityFor(product?.id ?? ""), 0);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const orderId = `KANSO-${(ids ?? []).join("").slice(-6).padStart(6, "0")}`;
    const order = { id: orderId, total, payment, name: String(form.get("name") ?? ""), createdAt: new Date().toISOString() };
    let orders: unknown[] = [];
    try {
      const storedOrders: unknown = JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? "[]");
      orders = Array.isArray(storedOrders) ? storedOrders : [];
    } catch {
      orders = [];
    }
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]));
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    window.localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new CustomEvent("kanso-cart-change"));
    setSubmitted(orderId);
  };

  if (isSignedIn === null || ids === null) return <main className="checkout-page" aria-busy="true"><section className="checkout-content"><p className="micro-label">Оформление</p><h1 className="sr-only">Оформление заказа</h1><p role="status">Проверяем корзину…</p></section></main>;
  if (!isSignedIn) return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/cart">Вернуться в корзину</Link></header><section className="checkout-content"><p className="micro-label">Оформление</p><h1>Войдите, чтобы продолжить</h1><p>Создайте аккаунт или войдите, чтобы оформить заказ.</p><Link className="button button-dark" href="/account">Войти или зарегистрироваться</Link></section></main>;
  if (!products.length) return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/cart">Вернуться в корзину</Link></header><section className="checkout-content"><p className="micro-label">Оформление</p><h1>Корзина пуста</h1><p>Добавьте товар в корзину, чтобы перейти к оформлению.</p><Link className="button button-dark" href="/catalog">Открыть каталог</Link></section></main>;
  if (submitted) return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/catalog">Продолжить покупки</Link></header><section className="checkout-content checkout-success"><p className="micro-label">Заявка сохранена</p><h1>Спасибо за заказ.</h1><p>Номер заказа: <strong>{submitted}</strong></p><p>Заявка сохранена в этом браузере. Реальная оплата и доставка пока не подключены.</p><Link className="button button-dark" href="/">Вернуться в KANSO</Link></section></main>;

  return <main className="checkout-page"><header className="account-page-header checkout-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/cart">Вернуться в корзину</Link></header><section className="checkout-content" aria-labelledby="checkout-title"><div className="checkout-intro"><div><p className="micro-label">Оформление заказа</p><h1 id="checkout-title">Ваш заказ</h1></div><p>Осталось заполнить данные доставки и выбрать удобный способ оплаты.</p></div><div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><div className="checkout-section"><p className="checkout-section-title">Данные получателя</p><div className="checkout-fields"><label>Имя<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Адрес доставки<input name="address" autoComplete="street-address" required /></label></div></div><fieldset><legend>Способ оплаты</legend><label className="radio-row"><input type="radio" name="payment" value="card" checked={payment === "card"} onChange={(event) => setPayment(event.target.value)} /> Банковская карта</label><label className="radio-row"><input type="radio" name="payment" value="on-delivery" checked={payment === "on-delivery"} onChange={(event) => setPayment(event.target.value)} /> Оплата при получении</label></fieldset>{payment === "card" && <div className="card-fields"><label>Номер карты<input inputMode="numeric" placeholder="0000 0000 0000 0000" pattern="[0-9 ]{16,19}" required /></label><div><label>Срок действия<input inputMode="numeric" placeholder="MM / YY" pattern="[0-9 /]{4,7}" required /></label><label>CVC<input inputMode="numeric" placeholder="000" pattern="[0-9]{3}" required /></label></div></div>}<p className="checkout-disclaimer" role="note">Данные не отправляются на сервер: текущий интерфейс сохраняет заявку только в этом браузере.</p><button className="button button-dark checkout-submit" type="submit">Сохранить заявку</button></form><aside className="checkout-summary" aria-label="Ваш заказ"><p className="micro-label">Ваш заказ</p><div className="checkout-summary-items">{uniqueProducts.map((product) => product && <div className="checkout-summary-row" key={product.id}><div className="checkout-summary-product"><div className="checkout-summary-image"><Image src={product.image} alt="" fill sizes="64px" /></div><span>{product.name}<small>{product.brand} · {quantityFor(product.id)} шт.</small></span></div><strong>{formatPrice(product.price * quantityFor(product.id))}</strong></div>)}</div><div className="checkout-total"><span>Итого</span><strong>{formatPrice(total)}</strong></div></aside></div></section></main>;
}
