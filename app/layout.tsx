import type { Metadata } from "next";
import "./globals.css";
import "./editor.css";
import "./workspace.css";

export const metadata: Metadata = {
  title: "Mysilo | Tesis tasarımı",
  description: "Arsa, ürün ve kapasiteye göre üç boyutlu tahıl tesisi planlama.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
