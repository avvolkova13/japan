import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Найти свой ритуал", description: "Демонстрационный подбор ухода KANSO по нескольким вопросам о коже и привычном ритме.", path: "/ritual" });

export default function RitualLayout({ children }: { children: ReactNode }) { return children; }
