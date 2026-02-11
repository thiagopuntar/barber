import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
    title: "Dashboard | Barber SaaS",
    description: "Visão geral do seu negócio.",
};

// Layout do Dashboard
// Combina a Sidebar, Header e a área de conteúdo principal
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex min-h-screen bg-zinc-950">
            {/* Background Texture */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-[0.03] mix-blend-overlay" />

            {/* Sidebar de Navegação */}
            <Sidebar />

            {/* Conteúdo Principal */}
            <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300 relative z-10">
                {/* Header Fixo */}
                <Header />

                {/* Área de Conteúdo Scrollável */}
                <main className="flex-1 p-4 pt-20 md:p-8 md:pt-24 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {children}
                </main>
            </div>
        </div>
    );
}
