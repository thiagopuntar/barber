import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

// Página de Gestão de Clientes
// Lista clientes, permite busca e adição de novos
export default function ClientsPage() {

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
                <div>
                    <h2 className="text-3xl font-bold uppercase tracking-widest text-foreground">
                        Clientes
                    </h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
                        Gerencie sua base de clientes.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider h-10 px-6 shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] border border-blue-500/50 transition-all">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                </Button>
            </div>

            {/* Barra de Busca de Clientes */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input

                        placeholder="BUSCAR CLIENTE..."
                        className="pl-9 h-10 bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 text-foreground placeholder:text-muted-foreground placeholder:text-xs placeholder:uppercase placeholder:tracking-wider rounded-sm focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <div className="rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-zinc-900/30 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border dark:border-zinc-800 bg-muted/50 dark:bg-zinc-900/80">
                            <th className="h-12 px-4 text-left font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Nome</th>
                            <th className="h-12 px-4 text-left font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Email</th>
                            <th className="h-12 px-4 text-left font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Telefone</th>
                            <th className="h-12 px-4 text-left font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Última Visita</th>
                            <th className="h-12 px-4 text-right font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="border-b border-border dark:border-zinc-800/50 hover:bg-muted/50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="p-4 font-medium text-foreground">João Silva {i}</td>
                                <td className="p-4 text-muted-foreground">joao.silva{i}@email.com</td>
                                <td className="p-4 text-muted-foreground">(11) 99999-999{i}</td>
                                <td className="p-4">
                                    <span className="inline-flex items-center rounded-sm bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 uppercase tracking-wide">
                                        há 2 dias
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-zinc-800 rounded-sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
