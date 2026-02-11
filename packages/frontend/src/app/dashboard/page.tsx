import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";

// Página Inicial do Dashboard
// Exibe métricas principais e resumos para o barbeiro
export default function DashboardPage() {

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold uppercase tracking-widest text-white">
                    Visão Geral
                </h2>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">
                    Resumo do desempenho da sua barbearia hoje.
                </p>
            </div>

            {/* Grid de Cards com Métricas Principais */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-zinc-400">
                            Faturamento Total
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white tracking-tight">R$ 1.250,00</div>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">
                            +20.1% em relação a ontem
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-zinc-400">
                            Agendamentos
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white tracking-tight">+12</div>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">
                            4 aguardando confirmação
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-zinc-400">
                            Novos Clientes
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white tracking-tight">+3</div>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">
                            +10% novos leads
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-zinc-400">
                            Ticket Médio
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white tracking-tight">R$ 85,00</div>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">
                            +5% desde a semana passada
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder para Gráfico ou Lista Recente */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm min-h-[300px]">
                    <CardHeader>
                        <CardTitle className="text-white text-lg uppercase tracking-wide">Receita Semanal</CardTitle>
                        <p className="text-zinc-500 text-xs uppercase tracking-wider">Acompanhamento diário</p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[200px] text-zinc-600 uppercase text-xs tracking-widest border border-dashed border-zinc-800 m-4 rounded-sm">
                        Gráfico de Receita (Placeholder)
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm min-h-[300px]">
                    <CardHeader>
                        <CardTitle className="text-white text-lg uppercase tracking-wide">Últimos Agendamentos</CardTitle>
                        <p className="text-zinc-500 text-xs uppercase tracking-wider">Hoje</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b border-zinc-800 pb-2 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white uppercase tracking-wide">Cliente Exemplo {i}</p>
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest">Corte + Barba</p>
                                    </div>
                                    <div className="text-sm font-bold text-blue-500 tracking-tight">14:00</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
