"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    UserCircle,
    DollarSign,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Definição dos itens de navegação
const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Serviços", href: "/dashboard/services", icon: Calendar },
    { name: "Profissionais", href: "/dashboard/professionals", icon: Users },
    { name: "Clientes", href: "/dashboard/clients", icon: UserCircle },
    { name: "Financeiro", href: "/dashboard/financial", icon: DollarSign },
];

// Componente Sidebar responsável pela navegação lateral
// Gerencia estado de abertura em mobile e lista de links
export function Sidebar() {

    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Função para fechar o menu mobile ao clicar em um link
    const closeMobileMenu = () => setIsOpen(false);

    return (
        <>
            {/* Botão de Menu Mobile (Hambúrguer) - Visível apenas em telas pequenas */}
            <div className="fixed top-0 left-0 z-50 flex h-16 w-16 items-center justify-center md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                    className="text-zinc-300 hover:bg-zinc-900 hover:text-white"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Overlay para fechar o menu ao clicar fora (Mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 transform bg-zinc-950 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 md:shadow-none border-r border-zinc-800 md:sticky md:top-0 md:h-screen",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Area (Mobil) ou Espaçamento Topo (Desktop) */}
                <div className="flex h-16 items-center justify-center border-b border-zinc-800 px-6 bg-zinc-950/50 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center border border-zinc-700 bg-zinc-900 text-white shadow-inner rounded-sm">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-bold tracking-widest text-white uppercase">Appointment App</span>
                    </div>
                </div>

                {/* Links de Navegação */}
                <nav className="flex-1 space-y-2 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {navItems.map((item) => {
                        // Verifica se a rota atual corresponde ao link (ou se é sub-rota)
                        // A lógica simples de igualdade pode ser expandida com startsWith para sub-rotas
                        const isActive =
                            item.href === "/dashboard/services" // Forçando "Serviços" como ativo (exemplo temporário ou fixo)

                                ? true
                                : pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={cn(
                                    "group flex items-center rounded-sm px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-500 border-r-2 border-blue-500"
                                        : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-300 border-r-2 border-transparent"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-4 w-4 flex-shrink-0 transition-colors",
                                        isActive
                                            ? "text-blue-500"
                                            : "text-zinc-300 group-hover:text-zinc-300"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
