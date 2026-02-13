"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PublicFooter() {
    const pathname = usePathname();



    return (
        <div className="py-8 flex justify-center space-x-6 text-[10px] uppercase tracking-widest text-zinc-600 bg-zinc-950 w-full">
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">
                Termos
            </Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
                Privacidade
            </Link>
        </div>
    );
}
