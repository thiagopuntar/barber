import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

// Componente de Cabeçalho (Header) principal da aplicação
// Exibe título, notificações e perfil do usuário.
export function Header() {

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 shadow-sm backdrop-blur-md md:px-6">
            {/* Lado Esquerdo: Título da Página ou Breadcrumbs (placeholder) */}
            <div className="flex items-center gap-4">
                {/* Espaço reservado para o botão do menu mobile (invisível aqui, controlado pela sidebar) */}
                <div className="w-8 md:hidden text-transparent">.</div>
                <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-100">Dashboard</h1>
            </div>

            {/* Lado Direito: Ações e Perfil */}
            <div className="flex items-center gap-4">
                {/* Botão de Notificações com ícone de sino */}
                <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-zinc-300 hover:bg-zinc-900 rounded-sm">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificações</span>
                </Button>


                <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
                    {/* Informações do Usuário (visível apenas em Desktop) */}
                    <div className="hidden text-right text-sm md:block">
                        <p className="font-bold text-zinc-200 text-xs uppercase tracking-wide">Admin User</p>
                        <p className="text-[10px] text-zinc-300 uppercase tracking-wider">admin@appointment.com</p>
                    </div>
                    {/* Avatar do Usuário com Fallback */}
                    <Avatar className="h-8 w-8 border border-zinc-700">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs">AD</AvatarFallback>
                    </Avatar>
                </div>

            </div>
        </header>
    );
}
