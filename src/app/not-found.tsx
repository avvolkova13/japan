import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <header className="account-page-header">
        <Link className="brand-mark" href="/">KANSO</Link>
        <Link className="catalog-back-link" href="/catalog">Вернуться в каталог</Link>
      </header>
      <section className="not-found-content" aria-labelledby="not-found-title">
        <p className="micro-label">404 / Не найдено</p>
        <h1 id="not-found-title">Эта страница не существует.</h1>
        <p>Попробуйте вернуться в каталог или начать с главной страницы KANSO.</p>
        <Link className="button button-dark" href="/catalog">Открыть каталог</Link>
      </section>
    </main>
  );
}
