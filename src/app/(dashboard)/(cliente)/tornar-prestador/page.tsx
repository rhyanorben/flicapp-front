"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProviderRequestForm } from "./_components/provider-request-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserRole } from "@/hooks/use-user-role";
import { Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ProviderRequest {
  id: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
}

export default function TornarPrestadorPage() {
  const { isProvider, isLoading } = useUserRole();
  const [existingRequest, setExistingRequest] =
    useState<ProviderRequest | null>(null);
  const [isFetchingRequest, setIsFetchingRequest] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkExistingRequest() {
      try {
        const response = await fetch("/api/provider-request");
        if (response.ok) {
          const requests = await response.json();
          const pending = requests.find(
            (req: ProviderRequest) => req.status === "PENDING"
          );
          setExistingRequest(pending || null);
        }
      } catch (error) {
        console.error("Error checking existing request:", error);
      } finally {
        setIsFetchingRequest(false);
      }
    }

    checkExistingRequest();
  }, [isProvider, isLoading, router]);

  if (isLoading || isFetchingRequest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">FlicApp</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Cliente</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tornar-se Prestador</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
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
              {existingRequest ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">
                        Solicitação em Análise
                      </p>
                      <p className="text-sm text-amber-700">
                        Você já possui uma solicitação pendente enviada em{" "}
                        {new Date(existingRequest.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 border-amber-300"
                    >
                      Pendente
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sua solicitação está sendo analisada por nossa equipe. Você
                    receberá uma notificação assim que houver uma decisão.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-900">
                      <strong>Atenção:</strong> Após enviar sua solicitação,
                      nossa equipe irá analisar suas informações. Você será
                      notificado sobre a decisão.
                    </p>
                  </div>
                  <ProviderRequestForm />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
