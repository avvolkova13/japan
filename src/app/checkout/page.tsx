"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const AUTH_KEY = "kanso-auth";

export default function CheckoutPage() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setIsSignedIn(Boolean(window.localStorage.getItem(AUTH_KEY))), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (isSignedIn === null) return <main className="checkout-page" aria-busy="true" />;
  if (!isSignedIn) return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/cart">Вернуться в корзину</Link></header><section className="checkout-content"><p className="micro-label">Оформление</p><h1>Войдите, чтобы продолжить</h1><p>Оформление заказа доступно только после входа в личный кабинет.</p><Link className="button button-dark" href="/account">Войти или зарегистрироваться</Link></section></main>;
  if (submitted) return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link></header><section className="checkout-content"><p className="micro-label">Заказ</p><h1>Данные сохранены</h1><p>Проверьте подключение backend и платёжного провайдера перед запуском реальных заказов.</p><Link className="button button-dark" href="/cart">Вернуться в корзину</Link></section></main>;

  return <main className="checkout-page"><header className="account-page-header"><Link className="brand-mark" href="/">KANSO</Link><Link className="catalog-back-link" href="/cart">Вернуться в корзину</Link></header><section className="checkout-content"><p className="micro-label">Оформление заказа</p><h1>Куда отправить заказ</h1><form className="checkout-form" onSubmit={submit}><label>Имя<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Адрес доставки<input name="address" autoComplete="street-address" required /></label><fieldset><legend>Способ оплаты</legend><label className="radio-row"><input type="radio" name="payment" value="card" required /> Банковская карта</label><label className="radio-row"><input type="radio" name="payment" value="placeholder" /> Другой способ после подключения оплаты</label></fieldset><button className="button button-dark" type="submit">Подтвердить данные заказа</button></form></section></main>;
}
