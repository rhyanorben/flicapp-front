import { HistoryTable } from "./_components/history-table";

export default function HistoricoPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
          <p className="text-muted-foreground">
            Visualize todos os seus pedidos finalizados e cancelados
          </p>
        </div>
        <HistoryTable />
      </div>
    </div>
  );
}
