import { RequestsOverviewCards } from "./_components/requests-overview-cards";
import { RequestsTable } from "./_components/requests-table";

export default function SolicitacoesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as solicitações de serviços dos clientes
          </p>
        </div>
        <RequestsOverviewCards />
        <RequestsTable />
      </div>
    </div>
  );
}
