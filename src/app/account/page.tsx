"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const AUTH_KEY = "kanso-auth";

type Account = { name: string; email: string };

function readAccount(): Account | null {
  try {
    const stored = window.localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setAccount(readAccount()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const name = mode === "register" ? String(form.get("name") ?? "").trim() : email.split("@")[0];
    const next = { name: name || "Покупатель", email };
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    setAccount(next);
    setMessage(mode === "register" ? "Аккаунт создан на этом устройстве." : "Вы вошли в аккаунт.");
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setAccount(null);
    setMessage("Вы вышли из аккаунта.");
  };

  return (
    <main className="account-page">
      <header className="account-page-header">
        <Link className="brand-mark" href="/">KANSO</Link>
        <Link className="catalog-back-link" href="/">Вернуться на главную</Link>
      </header>
      <section className="account-content" aria-labelledby="account-title">
        <p className="micro-label">Личный кабинет</p>
        {account ? (
          <div className="account-dashboard">
            <h1 id="account-title">Здравствуйте, {account.name}</h1>
            <p>Аккаунт создан для сохранения данных оформления и будущей истории заказов.</p>
            <div className="account-actions"><Link className="button button-dark" href="/cart">Перейти в корзину</Link><button className="text-link-button" type="button" onClick={logout}>Выйти</button></div>
          </div>
        ) : (
          <div className="account-auth-layout">
            <div><h1 id="account-title">Вход в KANSO</h1><p>Сохраняйте корзину и переходите к оформлению заказа после входа.</p></div>
            <form className="account-form" onSubmit={submit}>
              {mode === "register" && <label>Имя<input name="name" type="text" autoComplete="name" required /></label>}
              <label>Email<input name="email" type="email" autoComplete="email" required /></label>
              <label>Пароль<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required /></label>
              <button className="button button-dark" type="submit">{mode === "login" ? "Войти" : "Создать аккаунт"}</button>
              <button className="text-link-button" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Создать аккаунт" : "У меня уже есть аккаунт"}
              </button>
              {message && <p className="form-message" role="status">{message}</p>}
            </form>
          </div>
        )}
        {!account && message && <p className="form-message" role="status">{message}</p>}
      </section>
    </main>
  );
}
