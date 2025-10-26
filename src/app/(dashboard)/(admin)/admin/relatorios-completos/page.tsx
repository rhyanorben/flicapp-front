"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewCards } from "./_components/overview-cards";
import { UsersChart } from "./_components/users-chart";
import { RequestsSummary } from "./_components/requests-summary";
import { useStatistics } from "@/lib/queries/admin";

function RelatoriosCompletosData() {
  const router = useRouter();
  const { data: statistics, isLoading, error } = useStatistics();

  // Handle 403 redirect
  if (error?.message === "Acesso negado") {
    router.push("/dashboard");
  }

  if (isLoading) {
    return <RelatoriosCompletosDataSkeleton />;
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  return (
    <>
      <OverviewCards data={statistics} />

      <div className="grid gap-4 md:grid-cols-2">
        <UsersChart data={statistics.users.byMonth} />
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Solicitações</CardTitle>
            <CardDescription>
              Status das solicitações de prestador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-2xl font-bold">
                  {statistics.providerRequests.total}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pendentes</span>
                  <span className="font-medium">
                    {statistics.providerRequests.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Aprovadas</span>
                  <span className="font-medium">
                    {statistics.providerRequests.approved}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rejeitadas</span>
                  <span className="font-medium">
                    {statistics.providerRequests.rejected}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RequestsSummary
        requests={statistics.providerRequests.recent}
        requestsByMonth={statistics.providerRequests.byMonth}
      />
    </>
  );
}

function RelatoriosCompletosDataSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-56 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-full bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-full bg-muted animate-pulse rounded"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function RelatoriosCompletosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Relatórios Completos</CardTitle>
          <CardDescription>
            Visão geral detalhada de usuários, serviços e estatísticas do
            sistema
          </CardDescription>
        </CardHeader>
      </Card>
      <RelatoriosCompletosData />
    </div>
  );
}
