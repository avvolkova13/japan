import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Оформление заказа", description: "Демонстрационный сценарий оформления заказа KANSO.", path: "/checkout", noIndex: true });

export default function CheckoutLayout({ children }: { children: ReactNode }) { return children; }
