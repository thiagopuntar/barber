import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

// Página Financeira
// Exibe relatórios de receita, despesas e lucro
export default function FinancialPage() {

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
                <div>
                    <h2 className="text-3xl font-bold uppercase tracking-widest text-foreground">
                        Financeiro
                    </h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
                        Acompanhe o fluxo de caixa do seu negócio.
                    </p>
                </div>
                <Button variant="outline" className="bg-transparent text-muted-foreground border-border hover:bg-muted hover:text-foreground uppercase tracking-wider h-10 px-6 rounded-sm text-xs font-bold">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Relatório
                </Button>
            </div>

            {/* Cards de Resumo Financeiro */}
            <div className="grid gap-6 md:grid-cols-3">

                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-300">Receita Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground dark:text-white tracking-tight flex items-center gap-2">
                            R$ 12.450,00
                            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm flex items-center tracking-wide">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +12%
                            </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground dark:text-zinc-300 mt-2">Mês Atual</p>
                    </CardContent>
                </Card>
                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-300">Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground dark:text-white tracking-tight flex items-center gap-2">
                            R$ 4.200,00
                            <span className="text-xs font-medium text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-sm flex items-center tracking-wide">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                -2%
                            </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground dark:text-zinc-300 mt-2">Mês Atual</p>
                    </CardContent>
                </Card>
                <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-300">Lucro Líquido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-500 tracking-tight flex items-center gap-2">
                            R$ 8.250,00
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground dark:text-zinc-300 mt-2">Mês Atual</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 backdrop-blur-sm min-h-[400px]">
                <CardHeader>
                    <CardTitle className="text-foreground dark:text-white text-lg uppercase tracking-wide">Fluxo de Caixa</CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-zinc-300 text-xs uppercase tracking-wider">Entradas e saídas dos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground dark:text-zinc-700 uppercase text-xs tracking-[0.2em] border-2 border-dashed border-border dark:border-zinc-800/50 m-4 rounded-sm bg-muted/20 dark:bg-zinc-950/30">
                    Área para Gráfico Avançado
                </CardContent>
            </Card>
        </div>
    );
}
