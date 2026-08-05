import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Корзина", description: "Корзина демонстрационного каталога KANSO.", path: "/cart", noIndex: true });

export default function CartLayout({ children }: { children: ReactNode }) { return children; }
