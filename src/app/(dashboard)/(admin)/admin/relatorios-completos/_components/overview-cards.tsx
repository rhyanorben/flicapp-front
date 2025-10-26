"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { Users, UserCheck, Clock } from "lucide-react";
import { SparklineChart } from "./sparkline-chart";

interface OverviewCardsProps {
  data: {
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
    };
  };
}

export function OverviewCards({ data }: OverviewCardsProps) {
  // Convert monthly data to arrays for sparklines
  const userTrendData = Object.values(data.users.byMonth);
  const requestTrendData = Object.values(data.providerRequests.byMonth);

  // Calculate trends (simple month-over-month comparison)
  const getUserTrend = () => {
    const values = Object.values(data.users.byMonth);
    if (values.length < 2) return "flat";
    const latest = values[values.length - 1];
    const previous = values[values.length - 2];
    if (latest > previous) return "up";
    if (latest < previous) return "down";
    return "flat";
  };

  const getRequestTrend = () => {
    const values = Object.values(data.providerRequests.byMonth);
    if (values.length < 2) return "flat";
    const latest = values[values.length - 1];
    const previous = values[values.length - 2];
    if (latest > previous) return "up";
    if (latest < previous) return "down";
    return "flat";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="relative">
        <KpiCard
          label="Total de Usuários"
          value={data.users.total}
          icon={<Users className="h-5 w-5" />}
          caption="Usuários cadastrados no sistema"
          tone="primary"
          size="md"
          trend={getUserTrend()}
        />
        <div className="absolute bottom-2 right-2 w-16 h-8">
          <SparklineChart data={userTrendData} color="#3b82f6" height={32} />
        </div>
      </div>

      <div className="relative">
        <KpiCard
          label="Clientes"
          value={data.users.clients}
          icon={<Users className="h-5 w-5" />}
          caption="Usuários com role de cliente"
          tone="default"
          size="md"
        />
        <div className="absolute bottom-2 right-2 w-16 h-8">
          <SparklineChart data={userTrendData} color="#6b7280" height={32} />
        </div>
      </div>

      <div className="relative">
        <KpiCard
          label="Prestadores"
          value={data.users.providers}
          icon={<UserCheck className="h-5 w-5" />}
          caption="Usuários com role de prestador"
          tone="success"
          size="md"
        />
        <div className="absolute bottom-2 right-2 w-16 h-8">
          <SparklineChart data={userTrendData} color="#10b981" height={32} />
        </div>
      </div>

      <div className="relative">
        <KpiCard
          label="Solicitações Pendentes"
          value={data.providerRequests.pending}
          icon={<Clock className="h-5 w-5" />}
          caption="Aguardando revisão"
          tone="warning"
          size="md"
          trend={getRequestTrend()}
        />
        <div className="absolute bottom-2 right-2 w-16 h-8">
          <SparklineChart data={requestTrendData} color="#f59e0b" height={32} />
        </div>
      </div>
    </div>
  );
}
