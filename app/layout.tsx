import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tubeless Lab",
  description: "Manutenção de selante tubeless — saiba quando recarregar antes de secar.",
  metadataBase: new URL("https://tubelesslab.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Spectral:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
