"use client";

import { Calendar } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function PublicHeader() {
    const pathname = usePathname();

    // Não exibe o header no Dashboard
    if (pathname.startsWith("/dashboard")) {
        return null;
    }

    // Não exibe o header nas páginas de Booking (elas têm header próprio)
    if (pathname.startsWith("/booking")) {
        return null;
    }

    const isLoginPage = pathname === "/login" || pathname === "/";
    const headerClass = isLoginPage
        ? "absolute top-0 w-full z-50 bg-transparent text-center pt-8 pb-4"
        : "text-center pt-8 pb-4 bg-zinc-950 relative";

    return (
        <div className={headerClass}>
            <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
                <ThemeToggle />

            </div>

            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-border bg-primary text-white shadow-inner rounded-xl">
                <Calendar className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground">
                Service App
            </h1>
        </div>
    );
}
