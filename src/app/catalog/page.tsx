import Link from "next/link";
import { demoProducts } from "@/data/demo-products";
import { CatalogEditorialGrid } from "@/components/catalog-editorial-grid";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { CartNavLink } from "@/components/cart-nav-link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Каталог японской косметики",
  description: "Демонстрационный каталог японского ухода, косметики и wellness-продукции KANSO.",
  path: "/catalog",
});

type CatalogPageProps = {
  searchParams: Promise<{ brand?: string | string[]; category?: string | string[]; new?: string | string[]; focus?: string | string[]; sort?: string | string[] }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const rawBrand = Array.isArray(params.brand) ? params.brand[0] : params.brand;
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category;
  const rawNew = Array.isArray(params.new) ? params.new[0] : params.new;
  const rawFocus = Array.isArray(params.focus) ? params.focus[0] : params.focus;
  const rawSort = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const brand = rawBrand?.trim() ?? "";
  const category = rawCategory?.trim() ?? "";
  const isNew = rawNew === "true";
  const isHydration = rawFocus === "hydration";
  const sort = rawSort === "price-asc" || rawSort === "price-desc" ? rawSort : "default";
  const hydrationIds = new Set(["best-02", "best-03", "face-01", "face-02"]);
  const filteredProducts = demoProducts.filter((product) => {
    const matchesBrand = !brand || product.brand.toLowerCase() === brand.toLowerCase();
    const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase();
    return matchesBrand && matchesCategory && (!isNew || product.id.startsWith("new-")) && (!isHydration || hydrationIds.has(product.id));
  });
  const products = [...filteredProducts].sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : 0);
  const categories = [...new Set(demoProducts.map((product) => product.category))];
  const brands = [...new Set(demoProducts.map((product) => product.brand))];
  const quickTags = [
    { label: "Все", href: "/catalog", active: !brand && !category && !isNew && !isHydration },
    { label: "Новинки", href: "/catalog?new=true", active: isNew },
    { label: "Лицо", href: "/catalog?category=Face", active: category.toLowerCase() === "face" },
    { label: "Увлажнение", href: "/catalog?focus=hydration", active: isHydration },
    { label: "Волосы", href: "/catalog?category=Hair", active: category.toLowerCase() === "hair" },
    { label: "Wellness", href: "/catalog?category=Wellness", active: category.toLowerCase() === "wellness" },
  ];

  return (
    <main className="catalog-page">
      <header className="catalog-page-header">
        <Link className="brand-mark" href="/" aria-label="KANSO — на главную">KANSO</Link>
        <nav className="catalog-page-actions" aria-label="Покупательская навигация"><Link href="/account">Войти</Link><Link href="/favorites">Избранное</Link><CartNavLink /></nav>
      </header>
      <section className="catalog-page-content" aria-labelledby="catalog-title">
        <div className="catalog-editorial-hero">
          <div className="catalog-editorial-side catalog-editorial-side--left"><p>ЯПОНСКАЯ ТОЧНОСТЬ<br />В КАЖДОЙ ФОРМУЛЕ</p><span>Уход как ежедневный ритуал</span></div>
          <h1 id="catalog-title">КАТАЛОГ</h1>
          <div className="catalog-editorial-side catalog-editorial-side--right"><p>Современная эстетика<br />продуманных деталей</p><span>KANSO / 2026</span></div>
        </div>
        <nav className="catalog-quick-tags" aria-label="Быстрые подборки">{quickTags.map((tag) => <Link className={tag.active ? "is-active" : ""} href={tag.href} key={tag.label} aria-current={tag.active ? "page" : undefined}>{tag.label}</Link>)}</nav>
        <CatalogToolbar category={category} brand={brand} sort={sort} categories={categories} brands={brands} />
        {products.length > 0 ? (
          <CatalogEditorialGrid products={products} />
        ) : (
          <div className="catalog-empty-state">
            <h2>В этой подборке нет позиций</h2>
            <p>Попробуйте открыть весь каталог или выбрать другую категорию.</p>
            <Link className="button button-dark" href="/catalog"><span className="button-arrow" aria-hidden="true">↘</span><span className="button-label">Смотреть весь каталог</span></Link>
          </div>
        )}
      </section>
    </main>
  );
}
