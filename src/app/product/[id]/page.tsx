import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoProducts } from "@/data/demo-products";
import { ProductDetail } from "@/components/product-detail";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return demoProducts.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = demoProducts.find((item) => item.id === id);
  if (!product) return {};
  return createPageMetadata({ title: product.name, description: `${product.brand}. ${product.name} — демонстрационная карточка товара в каталоге KANSO.`, path: `/product/${product.id}` });
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = demoProducts.find((item) => item.id === id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
