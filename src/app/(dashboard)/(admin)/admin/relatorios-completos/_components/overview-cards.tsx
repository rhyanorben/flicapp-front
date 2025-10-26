"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { Users, UserCheck, Shield, Clock, CheckCircle } from "lucide-react";

interface OverviewCardsProps {
  data: {
    users: {
      total: number;
      admins: number;
      providers: number;
      clients: number;
    };
    providerRequests: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
  };
}

export function OverviewCards({ data }: OverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <KpiCard
        label="Total de Usuários"
        value={data.users.total}
        icon={<Users className="h-5 w-5" />}
        caption="Usuários cadastrados no sistema"
        tone="primary"
        size="md"
      />

      <KpiCard
        label="Clientes"
        value={data.users.clients}
        icon={<Users className="h-5 w-5" />}
        caption="Usuários com role de cliente"
        tone="default"
        size="md"
      />

      <KpiCard
        label="Prestadores"
        value={data.users.providers}
        icon={<UserCheck className="h-5 w-5" />}
        caption="Usuários com role de prestador"
        tone="success"
        size="md"
      />

      <KpiCard
        label="Administradores"
        value={data.users.admins}
        icon={<Shield className="h-5 w-5" />}
        caption="Usuários com role de administrador"
        tone="warning"
        size="md"
      />

      <KpiCard
        label="Solicitações Pendentes"
        value={data.providerRequests.pending}
        icon={<Clock className="h-5 w-5" />}
        caption="Aguardando revisão"
        tone="warning"
        size="md"
      />

      <KpiCard
        label="Solicitações Aprovadas"
        value={data.providerRequests.approved}
        icon={<CheckCircle className="h-5 w-5" />}
        caption="Total de aprovações"
        tone="success"
        size="md"
      />
    </div>
  );
}
