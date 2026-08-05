import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Избранное", description: "Сохранённые товары демонстрационного каталога KANSO.", path: "/favorites", noIndex: true });

export default function FavoritesLayout({ children }: { children: ReactNode }) { return children; }
