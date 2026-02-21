import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadados da aplicação (título e descrição para SEO)
export const metadata: Metadata = {
  title: "Appointment SaaS",
  description: "Gerencie seu negócio de agendamentos com facilidade.",
};

// Layout raiz da aplicação
// Envolve todas as páginas com as configurações globais (fontes, idioma, estilos)
export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PublicHeader />
        {children}
        <PublicFooter />
      </body>

    </html>
  );
}
