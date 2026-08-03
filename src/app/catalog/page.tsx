import Link from "next/link";
import { demoProducts } from "@/data/demo-products";
import { CatalogProductCard } from "@/components/catalog-product-card";
import { CatalogToolbar } from "@/components/catalog-toolbar";

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

  const featureRows = [];
  const compactRows = [];
  const fallbackProducts = [];
  let cursor = 0;
  while (cursor < products.length) {
    const featureProducts = products.slice(cursor, cursor + 6);
    if (featureProducts.length < 6) {
      fallbackProducts.push(...featureProducts);
      break;
    }
    featureRows.push(featureProducts);
    const compactProducts = products.slice(cursor + 6, cursor + 10);
    if (compactProducts.length > 0) compactRows.push(compactProducts);
    cursor += 10;
  }

  return (
    <main className="catalog-page">
      <header className="catalog-page-header">
        <Link className="brand-mark" href="/" aria-label="KANSO — на главную">KANSO</Link>
        <nav className="catalog-page-actions" aria-label="Покупательская навигация"><Link href="/account">Войти</Link><Link href="/favorites">Избранное</Link><Link href="/cart">Корзина</Link></nav>
      </header>
      <section className="catalog-page-content" aria-labelledby="catalog-title">
        <div className="catalog-breadcrumbs"><Link href="/">Главная</Link><span aria-hidden="true">/</span><span>Каталог</span>{isHydration && <><span aria-hidden="true">/</span><span>Увлажняющий уход</span></>}{isNew && <><span aria-hidden="true">/</span><span>Новинки</span></>}{brand && <><span aria-hidden="true">/</span><span>{brand}</span></>}{category && <><span aria-hidden="true">/</span><span>{category}</span></>}</div>
        <div className="catalog-intro-row"><div><p className="micro-label">Каталог KANSO</p><h1 id="catalog-title">{isHydration ? "Увлажняющий уход" : isNew ? "Новинки" : brand ? `Товары бренда ${brand}` : category ? `Уход: ${category}` : "Все товары"}</h1></div><p className="catalog-page-intro">Японская косметика, уход и wellness-продукция в продуманной подборке KANSO.</p></div>
        <CatalogToolbar category={category} brand={brand} sort={sort} categories={categories} brands={brands} /><span className="catalog-count catalog-count-after-toolbar">{products.length} позиций</span>
        {products.length > 0 ? (
          <div className="catalog-product-layout">
            {featureRows.map((row, rowIndex) => (
              <section className="catalog-feature-row" aria-label={`Подборка товаров ${rowIndex + 1}`} key={`feature-${rowIndex}`}>
                <CatalogProductCard product={row[0]} variant="feature-left" />
                {row.slice(1, 5).map((product) => <CatalogProductCard key={product.id} product={product} variant="small" />)}
                <CatalogProductCard product={row[5]} variant="feature-right" />
              </section>
            ))}
            {compactRows.map((row, rowIndex) => (
              <section className="catalog-small-row" aria-label={`Компактная подборка товаров ${rowIndex + 1}`} key={`compact-${rowIndex}`}>
                {row.map((product) => <CatalogProductCard key={product.id} product={product} variant="standard" />)}
              </section>
            ))}
            {fallbackProducts.length > 0 && <section className="catalog-small-row catalog-small-row-fallback" aria-label="Остальные товары">{fallbackProducts.map((product) => <CatalogProductCard key={product.id} product={product} variant="standard" />)}</section>}
          </div>
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
