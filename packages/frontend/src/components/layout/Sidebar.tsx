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
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Serviços", href: "/dashboard/services", icon: Calendar },
    { name: "Profissionais", href: "/dashboard/professionals", icon: Users },
    { name: "Clientes", href: "/dashboard/clients", icon: UserCircle },
    { name: "Financeiro", href: "/dashboard/financial", icon: DollarSign },
];

/**
 * Sidebar — lateral navigation for the dashboard.
 * Uses design system tokens (bg-card, border-border, text-muted-foreground, text-primary)
 * instead of hardcoded zinc-* colors, ensuring visual consistency with the global theme.
 */
export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const closeMobileMenu = () => setIsOpen(false);

    return (
        <>
            {/* Mobile hamburger button */}
            <div className="fixed top-0 left-0 z-50 flex h-16 w-16 items-center justify-center md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                    className="text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Overlay backdrop (mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 transform bg-card shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 md:shadow-none border-r border-border md:sticky md:top-0 md:h-screen flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Brand logo */}
                <div className="flex h-16 items-center justify-center border-b border-border px-6 bg-card/80 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground shadow-sm shadow-primary/30 rounded-md">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-bold tracking-widest text-foreground uppercase">
                            AgendaFácil
                        </span>
                    </div>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={cn(
                                    "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground border-r-2 border-transparent"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-4 w-4 flex-shrink-0 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer with theme toggle */}
                <div className="p-4 border-t border-border flex items-center justify-between mt-auto">
                    <span className="text-xs text-muted-foreground font-medium">Modo Escuro</span>
                    <ThemeToggle />
                </div>
            </aside>
        </>
    );
}
