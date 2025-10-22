import { AppSidebar } from "@/components/app-sidebar"
import { FinancialStats } from "./_components/financial-stats"
import { PerformanceStats } from "./_components/performance-stats"
import { ReportsCharts } from "./_components/reports-charts"
import DashboardHeader from "@/components/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function RelatoriosPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader title="Relatórios" page="Relatórios" />
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
      </SidebarInset>
    </SidebarProvider>
  )
}
