"use client";

type CatalogToolbarProps = {
  category: string;
  brand: string;
  sort: string;
  categories: readonly string[];
  brands: readonly string[];
};

export function CatalogToolbar({ category, brand, sort, categories, brands }: CatalogToolbarProps) {
  const update = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    window.location.assign(`/catalog?${params.toString()}`);
  };

  return (
    <div className="catalog-toolbar" aria-label="Параметры каталога">
      <label>Категория<select value={category} onChange={(event) => update("category", event.target.value)}><option value="">Все категории</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
      <label>Бренд<select value={brand} onChange={(event) => update("brand", event.target.value)}><option value="">Все бренды</option>{brands.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
      <label>Сортировка<select value={sort} onChange={(event) => update("sort", event.target.value)}><option value="default">По подборке</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option></select></label>
    </div>
  );
}
