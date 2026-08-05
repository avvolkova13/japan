import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journalStories } from "@/data/journal-stories";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return journalStories.filter((story) => story.slug !== "japanese-approach").map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = journalStories.find((item) => item.slug === slug);
  if (!story) return {};
  return createPageMetadata({ title: story.title, description: story.description, path: `/journal/${story.slug}` });
}

export default async function JournalStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = journalStories.find((item) => item.slug === slug);
  if (!story || story.slug === "japanese-approach") notFound();

  return (
    <main className="journal-article-page">
      <header className="journal-article-header"><Link className="brand-mark" href="/" aria-label="KANSO — на главную">KANSO</Link><Link className="catalog-back-link" href="/journal">Вернуться в журнал</Link></header>
      <article className="journal-article"><p className="micro-label">{story.category}</p><h1>{story.title}</h1><p className="journal-article-lead">{story.description}</p><div className="journal-article-hero"><Image src={story.image} alt={story.title} fill priority sizes="(max-width: 767px) 100vw, 72vw" /></div><div className="journal-article-body">{story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><Link className="text-link journal-article-back" href="/journal">Вернуться к журналу <span aria-hidden="true">↗</span></Link></article>
    </main>
  );
}
