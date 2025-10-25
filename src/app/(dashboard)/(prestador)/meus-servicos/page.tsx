import { ServicesHistoryTable } from "./_components/services-history-table";

export default function MeusServicosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Serviços</h1>
          <p className="text-muted-foreground">
            Histórico de todos os serviços que você já realizou
          </p>
        </div>
        <ServicesHistoryTable />
      </div>
    </div>
  );
}
