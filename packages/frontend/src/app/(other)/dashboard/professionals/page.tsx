import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, User, Star } from "lucide-react";
import Image from "next/image";

// Página de Profissionais
// Gerencia a equipe da barbearia
export default function ProfessionalsPage() {

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
                <div>
                    <h2 className="text-3xl font-bold uppercase tracking-widest text-foreground">
                        Profissionais
                    </h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
                        Gerencie a equipe do seu negócio.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider h-10 px-6 shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] border border-blue-500/50 transition-all">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Profissional
                </Button>
            </div>

            {/* Lista de Profissionais (Grid) */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (

                    <Card key={i} className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-all group overflow-hidden">
                        <div className="aspect-square relative w-full bg-muted dark:bg-zinc-950">
                            {/* Placeholder para foto do profissional */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground dark:text-zinc-800">
                                <User className="h-16 w-16" />
                            </div>
                            {/* Gradiente Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 dark:opacity-80" />

                            <div className="absolute bottom-4 left-4 z-10">
                                <h3 className="text-white font-bold uppercase tracking-wide text-lg">Profissional {i}</h3>
                                <p className="text-blue-500 text-xs uppercase tracking-widest font-medium">Especialista</p>
                            </div>
                        </div>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground dark:text-zinc-300 border-b border-border dark:border-zinc-800 pb-2">
                                <span>Avaliação</span>
                                <div className="flex items-center text-yellow-500 gap-1">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span className="font-bold text-foreground dark:text-white">4.9</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button className="w-full h-8 text-xs uppercase tracking-wider bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-transparent rounded-sm">
                                    Editar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
