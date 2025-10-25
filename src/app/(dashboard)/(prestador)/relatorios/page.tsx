import { FinancialStats } from "./_components/financial-stats";
import { PerformanceStats } from "./_components/performance-stats";
import { ReportsCharts } from "./_components/reports-charts";

export default function RelatoriosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Acompanhe suas estatísticas financeiras e de desempenho
          </p>
        </div>
        <FinancialStats />
        <PerformanceStats />
        <ReportsCharts />
      </div>
    </div>
  );
}
