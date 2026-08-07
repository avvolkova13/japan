import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог японской косметики | KANSO",
  description: "Демонстрационный каталог японского ухода, косметики и wellness-продукции KANSO.",
};

export default function CatalogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
