import { WhatsAppServiceRequest } from "./_components/whatsapp-service-request";

export default function SolicitarServicoPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Solicitar Serviço
          </h1>
          <p className="text-muted-foreground">
            Descreva o serviço que você precisa e gere um link do WhatsApp
          </p>
        </div>
        <WhatsAppServiceRequest />
      </div>
    </div>
  );
}
