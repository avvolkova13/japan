"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const AUTH_KEY = "kanso-auth";
const USERS_KEY = "kanso-users";

type Account = { name: string; email: string };
type StoredUser = Account & { password: string };
type AccountMode = "login" | "register" | "forgot";

function readAccount(): Account | null {
  try {
    const stored = window.localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function readUsers(): StoredUser[] {
  try { return JSON.parse(window.localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[]; } catch { return []; }
}

export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [mode, setMode] = useState<AccountMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setAccount(readAccount()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const users = readUsers();

    window.setTimeout(() => {
      if (mode === "forgot") {
        setMessage("Если аккаунт существует, письмо для восстановления уже отправлено.");
        setIsSubmitting(false);
        return;
      }
      if (mode === "login") {
        const user = users.find((item) => item.email === email);
        if (!user || user.password !== password) {
          setError("Неверный email или пароль.");
          setIsSubmitting(false);
          return;
        }
        const next = { name: user.name, email: user.email };
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
        setAccount(next);
        setMessage("Вы вошли в аккаунт.");
        setIsSubmitting(false);
        return;
      }
      const name = String(form.get("name") ?? "").trim();
      if (users.some((item) => item.email === email)) {
        setError("Аккаунт с таким email уже существует.");
        setIsSubmitting(false);
        return;
      }
      const next = { name: name || "Покупатель", email };
      window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, { ...next, password }]));
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
      setAccount(next);
      setMessage("Аккаунт создан.");
      setIsSubmitting(false);
    }, 320);
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setAccount(null);
    setMessage("Вы вышли из аккаунта.");
  };

  const title = mode === "register" ? "Создать аккаунт" : mode === "forgot" ? "Восстановить доступ" : "Войти в KANSO";
  const description = mode === "register" ? "Сохраняйте адреса, заказы и избранные средства." : mode === "forgot" ? "Введите email — мы отправим ссылку для восстановления доступа." : "Сохраняйте корзину и возвращайтесь к своим ритуалам ухода.";

  return (
    <main className="account-page">
      <header className="account-page-header">
        <Link className="brand-mark" href="/">KANSO</Link>
        <Link className="catalog-back-link" href="/">Вернуться в магазин</Link>
      </header>
      <section className="account-content" aria-labelledby="account-title">
        <p className="micro-label">Личный кабинет</p>
        {account ? (
          <div className="account-dashboard">
            <aside className="account-nav" aria-label="Разделы кабинета">
              <span className="account-nav-active">Обзор</span><Link href="/cart">Заказы</Link><span>Избранное</span><span>Адреса</span><button type="button" onClick={logout}>Выйти</button>
            </aside>
            <div className="account-dashboard-main">
              <p className="account-eyebrow">Ваш KANSO</p>
              <h1 id="account-title">Здравствуйте, {account.name}</h1>
              <p>Ваши покупки и предпочтения собраны в одном спокойном пространстве.</p>
              <div className="account-overview-grid"><div><span>Профиль</span><strong>{account.email}</strong></div><div><span>Корзина</span><strong><Link href="/cart">Открыть корзину ↗</Link></strong></div></div>
              {message && <p className="form-message" role="status">{message}</p>}
            </div>
          </div>
        ) : (
          <div className="account-auth-layout">
            <div className="account-auth-editorial">
              <div className="account-auth-visual"><Image src="/images/kanso/editorial.png" alt="Тихая композиция KANSO" fill sizes="(max-width: 767px) 100vw, 42vw" priority /></div>
              <div className="account-auth-caption"><span>KANSO / 01</span><span>Точный уход</span></div>
            </div>
            <div className="account-auth-panel">
              <h1 id="account-title">{title}</h1>
              <p className="account-auth-description">{description}</p>
              <form className="account-form" onSubmit={submit}>
                {mode === "register" && <label>Имя<input name="name" type="text" autoComplete="name" required /></label>}
                <label>Email<input name="email" type="email" autoComplete="email" required /></label>
                {mode !== "forgot" && <label>Пароль<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}>{showPassword ? "Скрыть" : "Показать"}</button></div>{mode === "register" && <small>Минимум 6 символов.</small>}</label>}
                {error && <p className="form-error" role="alert">{error}</p>}
                {message && <p className="form-message" role="status">{message}</p>}
                <button className="account-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Проверяем…" : mode === "register" ? "Создать аккаунт" : mode === "forgot" ? "Отправить ссылку" : "Войти"}</button>
              </form>
              <div className="account-auth-links">
                {mode === "login" && <button type="button" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}>Забыли пароль?</button>}
                <button type="button" onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); setMessage(""); }}>{mode === "register" ? "У меня уже есть аккаунт" : "Создать аккаунт"}</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
