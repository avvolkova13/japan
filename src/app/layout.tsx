import type { Metadata } from "next";
import { MotionObserver } from "@/components/motion-observer";
import "./globals.css";

export const metadata: Metadata = {
  title: "KANSO",
  description: "Японская косметика, уход и средства для благополучия KANSO.",
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
