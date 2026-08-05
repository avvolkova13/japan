import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Личный кабинет", description: "Вход и демонстрационный личный кабинет KANSO.", path: "/account", noIndex: true });

export default function AccountLayout({ children }: { children: ReactNode }) { return children; }
