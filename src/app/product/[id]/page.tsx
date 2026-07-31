import { notFound } from "next/navigation";
import { demoProducts } from "@/data/demo-products";
import { ProductDetail } from "@/components/product-detail";

export function generateStaticParams() {
  return demoProducts.map((product) => ({ id: product.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = demoProducts.find((item) => item.id === id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
