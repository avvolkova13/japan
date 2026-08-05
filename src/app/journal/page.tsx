import Image from "next/image";
import Link from "next/link";
import { journalStories } from "@/data/journal-stories";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Журнал",
  description: "Заметки KANSO о японском уходе, текстурах и спокойных ежедневных ритуалах.",
  path: "/journal",
});

export default function JournalPage() {
  return (
    <main className="journal-index-page">
      <header className="journal-index-header"><Link className="brand-mark" href="/" aria-label="KANSO — на главную">KANSO</Link><Link className="catalog-back-link" href="/">Вернуться в магазин</Link></header>
      <section className="journal-index-content" aria-labelledby="journal-index-title">
        <h1 id="journal-index-title">Философия KANSO</h1>
        <p className="journal-index-lead">Истории о небольших повторяемых жестах, текстурах и внимательном отношении к ежедневному уходу.</p>
        <div className="journal-index-grid">
          {journalStories.map((story) => (
            <Link className="journal-index-card" href={`/journal/${story.slug}`} key={story.slug}>
              <div className="journal-index-image"><Image src={story.image} alt={story.title} fill sizes="(max-width: 767px) 100vw, 33vw" /></div>
              <p className="micro-label">{story.category}</p><h2>{story.title}</h2><p>{story.description}</p><span className="text-link">Читать статью ↗</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
