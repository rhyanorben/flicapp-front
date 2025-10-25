"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, MapPin, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewRequest: () => void;
  requestData?: {
    id: string;
    serviceType: string;
    description: string;
    location: string;
    urgency: string;
    preferredDate?: string;
    preferredTime?: string;
  };
}

const urgencyLabels: Record<string, string> = {
  baixa: "Baixa",
  normal: "Normal",
  alta: "Alta",
};

const urgencyColors: Record<string, "default" | "secondary" | "destructive"> = {
  baixa: "default",
  normal: "secondary",
  alta: "destructive",
};

const urgencyEstimates: Record<string, string> = {
  baixa: "até 72h",
  normal: "24-48h",
  alta: "hoje",
};

export function SuccessDialog({
  open,
  onOpenChange,
  onNewRequest,
  requestData,
}: SuccessDialogProps) {
  const router = useRouter();

  const handleTrackOrder = () => {
    router.push("/meus-pedidos");
  };

  if (!requestData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl">Solicitação Enviada!</DialogTitle>
          <DialogDescription className="text-base">
            Sua solicitação foi recebida com sucesso. Você receberá uma
            confirmação em breve.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Número da solicitação
              </span>
              <span className="font-mono text-sm font-semibold">
                #{requestData.id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Serviço:</span>
                <span className="text-sm capitalize">
                  {requestData.serviceType}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {requestData.location}
                </span>
              </div>

              {requestData.preferredDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(requestData.preferredDate).toLocaleDateString(
                      "pt-BR"
                    )}
                    {requestData.preferredTime &&
                      ` às ${requestData.preferredTime}`}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Urgência:</span>
                <Badge
                  variant={urgencyColors[requestData.urgency]}
                  className="text-xs"
                >
                  {urgencyLabels[requestData.urgency]}
                </Badge>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 text-sm">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900">
                  Tempo estimado de resposta:{" "}
                  {urgencyEstimates[requestData.urgency]}
                </p>
                <p className="text-blue-700 mt-1">
                  Você poderá adicionar fotos depois no acompanhamento do
                  pedido.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleTrackOrder}
            className="w-full sm:w-auto"
          >
            Acompanhar Pedido
          </Button>
          <Button onClick={onNewRequest} className="w-full sm:w-auto">
            Fazer Nova Solicitação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
