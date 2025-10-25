"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { OverviewCards } from "./_components/overview-cards";
import { UsersChart } from "./_components/users-chart";
import { RequestsSummary } from "./_components/requests-summary";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProviderWrapper } from "@/components/sidebar-provider-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProviderRequest {
  id: string;
  userId: string;
  user: User;
  status: string;
  createdAt: string;
}

interface StatisticsData {
  users: {
    total: number;
    admins: number;
    providers: number;
    clients: number;
    byMonth: {
      [month: string]: number;
    };
  };
  providerRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byMonth: {
      [month: string]: number;
    };
    recent: ProviderRequest[];
  };
}

export default function RelatoriosCompletosPage() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/admin/statistics");
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      } else if (response.status === 403) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [router]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  return (
    <SidebarProviderWrapper>
      <AppSidebar />
      <SidebarInset>
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
                  <BreadcrumbLink href="/dashboard">
                    FlicApp
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">
                    Administração
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Relatórios Completos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Relatórios Completos</CardTitle>
              <CardDescription>
                Visão geral detalhada de usuários, serviços e estatísticas do sistema
              </CardDescription>
            </CardHeader>
          </Card>

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
        </div>
      </SidebarInset>
    </SidebarProviderWrapper>
  );
}

