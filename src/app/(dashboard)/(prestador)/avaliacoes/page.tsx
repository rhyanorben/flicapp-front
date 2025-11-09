import { RatingsOverview } from "./_components/ratings-overview";
import { RatingsChart } from "./_components/ratings-chart";
import { Separator } from "@/components/ui/separator";

export default function AvaliacoesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas estatísticas de avaliações e desempenho
          </p>
        </div>

        {/* Overview Cards */}
        <RatingsOverview />

        <Separator />

        {/* Distribution Chart */}
        <RatingsChart />
      </div>
    </div>
  );
}
