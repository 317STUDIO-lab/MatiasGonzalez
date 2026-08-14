import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matías González — Diseñador Gráfico",
  description:
    "Portfolio de Matías González, diseñador gráfico especializado en branding y dirección de arte.",
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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
