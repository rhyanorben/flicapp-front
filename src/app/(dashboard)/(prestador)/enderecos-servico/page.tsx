import { ServiceAddressesList } from "./_components/service-addresses-list";

export default function EnderecosServicoPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Endereços de Serviço
          </h1>
          <p className="text-muted-foreground">
            Selecione os endereços onde você deseja prestar serviços
          </p>
        </div>
        <ServiceAddressesList />
      </div>
    </div>
  );
}

