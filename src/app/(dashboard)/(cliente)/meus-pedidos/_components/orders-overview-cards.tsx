"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useOrderStats } from "@/hooks/use-orders";

export function OrdersOverviewCards() {
  const { data, isLoading, error } = useOrderStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-lg border bg-background animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-8 bg-muted rounded w-12" />
              </div>
              <div className="h-8 w-8 bg-muted rounded" />
            </div>
            <div className="mt-4 h-3 bg-muted rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Erro ao carregar estatísticas dos pedidos.
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { stats, deltas } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <KpiCard
        label="Total de Pedidos"
        value={stats.total}
        delta={deltas.total}
        trend="up"
        tone="primary"
        icon={<Clock className="h-4 w-4 text-primary" />}
        caption="vs mês anterior"
      />
      <KpiCard
        label="Aguardando"
        value={stats.aguardando}
        delta={deltas.aguardando}
        trend="down"
        tone="warning"
        icon={
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
        }
        caption="vs mês anterior"
      />
      <KpiCard
        label="Em Andamento"
        value={stats.emAndamento}
        delta={deltas.emAndamento}
        trend="up"
        tone="primary"
        icon={<Clock className="h-4 w-4 text-primary" />}
        caption="vs mês anterior"
      />
      <KpiCard
        label="Concluídos"
        value={stats.concluidos}
        delta={deltas.concluidos}
        trend="up"
        tone="success"
        icon={
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
        }
        caption="vs mês anterior"
      />
      <KpiCard
        label="Cancelados"
        value={stats.cancelados}
        delta={deltas.cancelados}
        trend="down"
        tone="danger"
        icon={<XCircle className="h-4 w-4 text-destructive" />}
        caption="vs mês anterior"
      />
    </div>
  );
}
