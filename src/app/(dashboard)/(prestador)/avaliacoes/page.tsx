import { RatingsOverview } from "./_components/ratings-overview";
import { RatingsChart } from "./_components/ratings-chart";
import { RatingsList } from "./_components/ratings-list";
import DashboardHeader from "@/components/dashboard-header";

export default function AvaliacoesPage() {
  return (
    <>
      <DashboardHeader title="Avaliações" page="Avaliações" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
            <p className="text-muted-foreground">
              Acompanhe suas avaliações e feedback dos clientes
            </p>
          </div>
          <RatingsOverview />
          <div className="grid gap-4 md:grid-cols-2">
            <RatingsChart />
            <div className="space-y-4">
              <RatingsList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
