import type { Metadata } from "next";
import { MotionObserver } from "@/components/motion-observer";
import { publicSiteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: publicSiteUrl ? new URL(publicSiteUrl) : undefined,
  title: { default: "KANSO — японский уход и тихие ритуалы", template: "%s — KANSO" },
  description: "Японская косметика, уход и средства для благополучия KANSO.",
  alternates: publicSiteUrl ? { canonical: publicSiteUrl } : undefined,
  robots: publicSiteUrl ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body><MotionObserver />{children}</body>
    </html>
  );
}
