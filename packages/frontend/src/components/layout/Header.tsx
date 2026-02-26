import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Header — top bar for the dashboard layout.
 * Uses design system tokens (bg-background, border-border, text-foreground, text-muted-foreground)
 * instead of hardcoded zinc-* colors, ensuring visual consistency with the global theme.
 */
export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 shadow-sm backdrop-blur-md md:px-6">
            {/* Left — page title placeholder */}
            <div className="flex items-center gap-4">
                <div className="w-8 md:hidden text-transparent">.</div>
                <h1 className="text-sm font-bold tracking-widest text-foreground uppercase">
                    Dashboard
                </h1>
            </div>

            {/* Right — actions and user profile */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                >
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificações</span>
                </Button>

                <div className="flex items-center gap-2 border-l border-border pl-4">
                    <div className="hidden text-right text-sm md:block">
                        <p className="font-bold text-foreground text-xs uppercase tracking-wide">
                            Admin User
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            admin@agendafacil.com
                        </p>
                    </div>
                    <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                        <AvatarFallback className="bg-muted text-foreground text-xs">AD</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
