import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { PWA } from "@/components/PWA";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Copa 2026 — Mata-Mata",
  description:
    "Simulador do mata-mata da Copa do Mundo 2026: 16-avos de final, prorrogação, pênaltis e coroação do campeão.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon-192.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Copa 2026" },
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <PWA />
      </body>
    </html>
  );
}
