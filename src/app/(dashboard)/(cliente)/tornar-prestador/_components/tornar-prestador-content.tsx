"use client";

import { ProviderRequestForm } from "./provider-request-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserProviderRequests } from "@/lib/queries/provider-requests";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TornarPrestadorSkeleton } from "./tornar-prestador-skeleton";

export function TornarPrestadorContent() {
  const { data: requests, isLoading } = useUserProviderRequests();

  if (isLoading) {
    return <TornarPrestadorSkeleton />;
  }

  const pendingRequest = requests?.find((req) => req.status === "PENDING");
  const rejectedRequest = requests?.find((req) => req.status === "REJECTED");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Tornar-se um Prestador de Serviços
            </CardTitle>
            <CardDescription>
              Preencha o formulário abaixo para solicitar seu cadastro como
              prestador de serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequest ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      Solicitação em Análise
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Você já possui uma solicitação pendente enviada em{" "}
                      {new Date(pendingRequest.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
                  >
                    Pendente
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sua solicitação está sendo analisada por nossa equipe. Você
                  receberá uma notificação assim que houver uma decisão.
                </p>
              </div>
            ) : rejectedRequest ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                  <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900 dark:text-red-100">
                      Solicitação Rejeitada
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Sua solicitação foi rejeitada em{" "}
                      {new Date(
                        rejectedRequest.reviewedAt || rejectedRequest.updatedAt
                      ).toLocaleDateString("pt-BR")}
                      .
                    </p>
                    {rejectedRequest.rejectionReason && (
                      <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                          Motivo da Rejeição:
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {rejectedRequest.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700"
                  >
                    Rejeitada
                  </Badge>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Você pode enviar uma nova solicitação após revisar os
                    motivos da rejeição.
                  </p>
                </div>
                <ProviderRequestForm />
              </div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Atenção:</strong> Após enviar sua solicitação, nossa
                    equipe irá analisar suas informações. Você será notificado
                    sobre a decisão.
                  </p>
                </div>
                <ProviderRequestForm />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
