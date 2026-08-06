"use client";

import { useState } from "react";
import { CatalogProductCard } from "@/components/catalog-product-card";
import type { DemoProduct } from "@/types/product";

const PRODUCTS_PER_GROUP = 6;
const INITIAL_VISIBLE_GROUPS = 2;

export function CatalogEditorialGrid({ products }: { products: readonly DemoProduct[] }) {
  const [visibleGroupCount, setVisibleGroupCount] = useState(INITIAL_VISIBLE_GROUPS);
  const visibleProducts = products.slice(0, visibleGroupCount * PRODUCTS_PER_GROUP);
  const groups: Array<{ small: readonly DemoProduct[]; feature: readonly DemoProduct[] }> = [];

  for (let cursor = 0; cursor < visibleProducts.length; cursor += PRODUCTS_PER_GROUP) {
    groups.push({
      small: visibleProducts.slice(cursor, cursor + 4),
      feature: visibleProducts.slice(cursor + 4, cursor + PRODUCTS_PER_GROUP),
    });
  }

  const hasMore = visibleProducts.length < products.length;

  return (
    <div className="catalog-editorial-shell">
      <div className="catalog-editorial-layout">
        {groups.map((group, groupIndex) => (
          <section className="catalog-editorial-group" aria-label={`Подборка товаров ${groupIndex + 1}`} key={`editorial-${groupIndex}`}>
            {group.small.length > 0 && <div className="catalog-editorial-small-row">{group.small.map((product) => <CatalogProductCard key={product.id} product={product} variant="small" />)}</div>}
            {group.feature.length > 0 && <div className="catalog-editorial-feature-row">{group.feature.map((product) => <CatalogProductCard key={product.id} product={product} variant="standard" />)}</div>}
          </section>
        ))}
      </div>
      {hasMore && (
        <div className="catalog-load-more">
          <button className="button button-dark catalog-load-more-button" type="button" onClick={() => setVisibleGroupCount((count) => count + 1)}>
            <span className="button-arrow" aria-hidden="true">↓</span>
            <span className="button-label">Показать ещё</span>
          </button>
        </div>
      )}
      <span className="sr-only" aria-live="polite">Показано {visibleProducts.length} из {products.length} товаров</span>
    </div>
  );
}
