/**
 * Layout raíz (Server Component): idioma español, fuentes Geist, Header y Footer.
 * El contenido de cada página se centra en un contenedor responsive.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // "template" agrega " | Clima SV" al título que defina cada página.
  title: {
    default: "Clima SV — El clima de El Salvador",
    template: "%s | Clima SV",
  },
  description:
    "Consulta el clima actual y el pronóstico de los 14 departamentos de El Salvador, con datos de OpenWeather.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-fondo text-texto">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
