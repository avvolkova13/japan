import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { informationPages, informationSlugs, isInformationSlug, type InformationPage } from "@/data/information-pages";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return informationSlugs.map((info) => ({ info }));
}

export async function generateMetadata({ params }: { params: Promise<{ info: string }> }): Promise<Metadata> {
  const { info } = await params;
  if (!isInformationSlug(info)) return {};
  const page: InformationPage = informationPages[info];
  return createPageMetadata({ title: page.title, description: page.lead, path: `/${info}` });
}

export default async function InformationPageRoute({ params }: { params: Promise<{ info: string }> }) {
  const { info } = await params;
  if (!isInformationSlug(info)) notFound();
  const page: InformationPage = informationPages[info];

  return (
    <main className="information-page">
      <header className="information-header">
        <Link className="brand-mark" href="/" aria-label="KANSO — на главную">KANSO</Link>
        <nav aria-label="Навигация информационной страницы">
          <Link href="/catalog">Каталог</Link>
          <Link href="/journal">Журнал</Link>
        </nav>
      </header>
      <article className="information-content" aria-labelledby="information-title">
        <div className="information-hero">
          <p className="micro-label">{page.eyebrow}</p>
          <h1 id="information-title">{page.title}</h1>
          <p className="information-lead">{page.lead}</p>
        </div>
        {page.note && <aside className="information-note" aria-label="Важная информация"><span aria-hidden="true">i</span><p>{page.note}</p></aside>}
        <div className="information-sections">
          {page.sections.map((section, index) => (
            <section key={section.title} aria-labelledby={`information-section-${index}`}>
              <span className="information-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h2 id={`information-section-${index}`}>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>
          ))}
        </div>
        <div className="information-footer-nav">
          <Link className="text-link" href="/">На главную <span aria-hidden="true">↗</span></Link>
          <Link className="text-link" href="/catalog">Открыть каталог <span aria-hidden="true">↗</span></Link>
        </div>
      </article>
    </main>
  );
}
