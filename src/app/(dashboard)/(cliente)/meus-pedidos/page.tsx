import { OrdersOverviewCards } from "./_components/orders-overview-cards";
import { OrdersTable } from "./_components/orders-table";

export default function MeusPedidosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
          <p className="text-muted-foreground">
            Acompanhe todos os seus pedidos de serviço
          </p>
        </div>
        <OrdersOverviewCards />
        <OrdersTable />
      </div>
    </div>
  );
}
