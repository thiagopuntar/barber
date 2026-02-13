import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";

// Página de Serviços
// Lista e gerencia os serviços oferecidos
export default function ServicesPage() {

    return (
        <div className="space-y-8">
            {/* Cabeçalho da Página */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
                <div>
                    <h2 className="text-3xl font-bold uppercase tracking-widest text-white">
                        Serviços
                    </h2>
                    <p className="text-zinc-300 text-xs uppercase tracking-wider mt-1">
                        Gerencie os serviços oferecidos na sua barbearia.
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
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
                    <CardHeader>
                        <CardTitle className="text-white text-lg uppercase tracking-wide group-hover:text-blue-400 transition-colors">Corte de Cabelo</CardTitle>
                        <CardDescription className="text-zinc-300 text-xs uppercase tracking-wider">Clássico ou Moderno</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-2">
                            <span className="text-2xl font-bold text-white tracking-tight">R$ 50,00</span>
                            <div className="px-2 py-1 bg-zinc-800 rounded-sm text-[10px] uppercase font-bold text-zinc-300 tracking-wider">
                                30 min
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card de Exemplo 2 */}
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
                    <CardHeader>
                        <CardTitle className="text-white text-lg uppercase tracking-wide group-hover:text-blue-400 transition-colors">Barba</CardTitle>
                        <CardDescription className="text-zinc-300 text-xs uppercase tracking-wider">Modelagem e Hidratação</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-2">
                            <span className="text-2xl font-bold text-white tracking-tight">R$ 35,00</span>
                            <div className="px-2 py-1 bg-zinc-800 rounded-sm text-[10px] uppercase font-bold text-zinc-300 tracking-wider">
                                20 min
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card de Exemplo 3 */}
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
                    <CardHeader>
                        <CardTitle className="text-white text-lg uppercase tracking-wide group-hover:text-blue-400 transition-colors">Combo Completo</CardTitle>
                        <CardDescription className="text-zinc-300 text-xs uppercase tracking-wider">Cabelo + Barba + Sobrancelha</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-2">
                            <span className="text-2xl font-bold text-white tracking-tight">R$ 80,00</span>
                            <div className="px-2 py-1 bg-zinc-800 rounded-sm text-[10px] uppercase font-bold text-zinc-300 tracking-wider">
                                50 min
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
