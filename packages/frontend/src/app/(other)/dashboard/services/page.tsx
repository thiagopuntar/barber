import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";

// Página de Serviços
// Lista e gerencia os serviços oferecidos
export default function ServicesPage() {

    return (
        <div className="space-y-8">
            {/* Cabeçalho da Página */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
                <div>
                    <h2 className="text-3xl font-bold uppercase tracking-widest text-foreground">
                        Serviços
                    </h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
                        Gerencie os serviços oferecidos no seu negócio.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider h-10 px-6 shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] border border-blue-500/50 transition-all">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Serviço
                </Button>
            </div>

            {/* Grid de Cards (Placeholder) */}
            {/* Grid de Cards de Serviços */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {/* Card de Exemplo 1 */}
                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors group">
                    <CardHeader>
                        <CardTitle className="text-foreground dark:text-white text-lg uppercase tracking-wide group-hover:text-primary transition-colors">Consultoria</CardTitle>
                        <CardDescription className="text-muted-foreground text-xs uppercase tracking-wider">Presencial ou Online</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between border-t border-border dark:border-zinc-800 pt-4 mt-2">
                            <span className="text-2xl font-bold text-foreground dark:text-white tracking-tight">R$ 50,00</span>
                            <div className="px-2 py-1 bg-muted dark:bg-zinc-800 rounded-sm text-[10px] uppercase font-bold text-muted-foreground dark:text-zinc-300 tracking-wider">
                                30 min
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card de Exemplo 2 */}
                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors group">
                    <CardHeader>
                        <CardTitle className="text-foreground dark:text-white text-lg uppercase tracking-wide group-hover:text-primary transition-colors">Manutenção</CardTitle>
                        <CardDescription className="text-muted-foreground text-xs uppercase tracking-wider">Reparo e Ajustes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between border-t border-border dark:border-zinc-800 pt-4 mt-2">
                            <span className="text-2xl font-bold text-foreground dark:text-white tracking-tight">R$ 35,00</span>
                            <div className="px-2 py-1 bg-muted dark:bg-zinc-800 rounded-sm text-[10px] uppercase font-bold text-muted-foreground dark:text-zinc-300 tracking-wider">
                                20 min
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card de Exemplo 3 */}
                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors group">
                    <CardHeader>
                        <CardTitle className="text-foreground dark:text-white text-lg uppercase tracking-wide group-hover:text-primary transition-colors">Pacote Mensal</CardTitle>
                        <CardDescription className="text-muted-foreground text-xs uppercase tracking-wider">4 Sessões + Acompanhamento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between border-t border-border dark:border-zinc-800 pt-4 mt-2">
                            <span className="text-2xl font-bold text-foreground dark:text-white tracking-tight">R$ 80,00</span>
                            <div className="px-2 py-1 bg-muted dark:bg-zinc-800 rounded-sm text-[10px] uppercase font-bold text-muted-foreground dark:text-zinc-300 tracking-wider">
                                50 min
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
