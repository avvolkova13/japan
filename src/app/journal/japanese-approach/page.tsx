import Image from "next/image";
import Link from "next/link";

export default function JapaneseApproachPage() {
  return (
    <main className="journal-article-page">
      <header className="journal-article-header">
        <Link className="brand-mark" href="/" aria-label="KANSO — на главную">KANSO</Link>
        <Link className="catalog-back-link" href="/">Вернуться на главную</Link>
      </header>
      <article className="journal-article">
        <p className="micro-label">Редакция</p>
        <h1>Японский подход к ежедневному уходу</h1>
        <p className="journal-article-lead">История о небольших повторяемых жестах, из которых складывается личный ритуал.</p>
        <div className="journal-article-hero">
          <Image src="/images/kanso/editorial.png" alt="Нанесение уходового средства на кожу" fill priority sizes="(max-width: 767px) 100vw, 72vw" />
        </div>
        <div className="journal-article-body">
          <p>Уход начинается не с количества средств, а с внимания к ежедневным ощущениям. Несколько спокойных шагов помогают услышать потребности кожи и оставить в ритме дня место для себя.</p>
          <p>Японский подход строится на последовательности, мягких текстурах и уважении к собственному темпу. Очищение, увлажнение и защита становятся не списком обязательных действий, а понятной привычкой.</p>
          <p>Так формируется личный ритуал: простой, повторяемый и достаточно гибкий, чтобы оставаться с вами каждый день.</p>
        </div>
        <Link className="text-link journal-article-back" href="/">Вернуться к подборке <span aria-hidden="true">↗</span></Link>
      </article>
    </main>
  );
}
