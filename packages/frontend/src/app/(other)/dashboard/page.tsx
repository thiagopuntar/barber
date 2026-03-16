import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import { BOOKINGS } from "@/lib/mock-data";

// Página Inicial do Dashboard
// Exibe métricas principais e resumos para o barbeiro
export default function DashboardPage() {

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold uppercase tracking-widest text-foreground">
                    Visão Geral
                </h2>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                    Resumo do desempenho do seu negócio hoje.
                </p>
            </div>

            {/* Grid de Cards com Métricas Principais */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-300">
                            Faturamento Total
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground dark:text-white tracking-tight">R$ 1.250,00</div>
                        <p className="text-xs text-muted-foreground dark:text-zinc-300 mt-1 uppercase tracking-wide">
                            +20.1% em relação a ontem
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-300">
                            Agendamentos
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground dark:text-white tracking-tight">+12</div>
                        <p className="text-xs text-muted-foreground dark:text-zinc-300 mt-1 uppercase tracking-wide">
                            4 aguardando confirmação
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-300">
                            Novos Clientes
                        </CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground dark:text-white tracking-tight">+3</div>
                        <p className="text-xs text-muted-foreground dark:text-zinc-300 mt-1 uppercase tracking-wide">
                            +10% novos leads
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-300">
                            Ticket Médio
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground dark:text-white tracking-tight">R$ 85,00</div>
                        <p className="text-xs text-muted-foreground dark:text-zinc-300 mt-1 uppercase tracking-wide">
                            +5% desde a semana passada
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder para Gráfico ou Lista Recente */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm min-h-[300px]">
                    <CardHeader>
                        <CardTitle className="text-foreground dark:text-white text-lg uppercase tracking-wide">Receita Semanal</CardTitle>
                        <p className="text-muted-foreground dark:text-zinc-300 text-xs uppercase tracking-wider">Acompanhamento diário</p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground dark:text-zinc-300 uppercase text-xs tracking-widest border border-dashed border-border dark:border-zinc-800 m-4 rounded-sm">
                        Gráfico de Receita (Placeholder)
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm min-h-[300px]">
                    <CardHeader>
                        <CardTitle className="text-foreground dark:text-white text-lg uppercase tracking-wide">Últimos Agendamentos</CardTitle>
                        <p className="text-muted-foreground dark:text-zinc-300 text-xs uppercase tracking-wider">Hoje</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {BOOKINGS.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between border-b border-border dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-foreground dark:text-white uppercase tracking-wide">{booking.customerName}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{booking.serviceName}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-primary tracking-tight">{booking.time}</span>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${booking.status === 'confirmed' ? 'text-emerald-500' :
                                                booking.status === 'pending' ? 'text-amber-500' :
                                                    booking.status === 'canceled' ? 'text-rose-500' : 'text-slate-400'
                                            }`}>
                                            {booking.status === 'confirmed' ? 'Confirmado' :
                                                booking.status === 'pending' ? 'Pendente' :
                                                    booking.status === 'canceled' ? 'Cancelado' : 'Concluído'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
