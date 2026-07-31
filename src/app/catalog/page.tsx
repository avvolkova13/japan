import Link from "next/link";
import { demoProducts } from "@/data/demo-products";
import { CatalogProductCard } from "@/components/catalog-product-card";

type CatalogPageProps = {
  searchParams: Promise<{ brand?: string | string[] }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const rawBrand = Array.isArray(params.brand) ? params.brand[0] : params.brand;
  const brand = rawBrand?.trim() ?? "";
  const products = brand
    ? demoProducts.filter((product) => product.brand.toLowerCase() === brand.toLowerCase())
    : demoProducts;

  return (
    <main className="catalog-page">
      <header className="catalog-page-header">
        <Link className="brand-mark" href="/" aria-label="KANSO — на главную">KANSO</Link>
        <Link className="catalog-back-link" href="/">Вернуться на главную</Link>
      </header>
      <section className="catalog-page-content" aria-labelledby="catalog-title">
        <div className="catalog-breadcrumbs"><Link href="/">Главная</Link><span aria-hidden="true">/</span><span>Каталог</span>{brand && <><span aria-hidden="true">/</span><span>{brand}</span></>}</div>
        <div className="catalog-intro-row"><div><p className="micro-label">Каталог KANSO</p><h1 id="catalog-title">{brand ? `Товары бренда ${brand}` : "Все товары"}</h1></div><p className="catalog-page-intro">Японская косметика, уход и wellness-продукция в продуманной подборке KANSO.</p></div>
        <div className="catalog-toolbar"><button type="button">Категория <span className="catalog-select-arrow" aria-hidden="true" /></button><button type="button">Бренд <span className="catalog-select-arrow" aria-hidden="true" /></button><button type="button">Сортировка <span className="catalog-select-arrow" aria-hidden="true" /></button><span className="catalog-count">{products.length} позиций</span></div>
        {products.length > 0 ? (
          <div className="catalog-product-grid">
            {products.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty-state">
            <h2>Позиции бренда появятся в каталоге</h2>
            <p>Сейчас для этой фирмы нет опубликованных позиций в текущей подборке.</p>
            <Link className="button button-dark" href="/catalog"><span className="button-arrow" aria-hidden="true">↘</span><span className="button-label">Смотреть весь каталог</span></Link>
          </div>
        )}
      </section>
    </main>
  );
}
