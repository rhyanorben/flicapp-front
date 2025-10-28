"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useProviderRequestStats } from "@/hooks/use-provider-requests";

export function RequestsOverviewCards() {
  const { data, isLoading, error } = useProviderRequestStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
        Erro ao carregar estatísticas das solicitações.
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
        label="Pendentes"
        value={stats.pendentes}
        delta={deltas.pendentes}
        trend="up"
        tone="warning"
        icon={<Clock className="h-4 w-4 text-amber-600 dark:text-amber-300" />}
        caption="vs mês anterior"
      />
      <KpiCard
        label="Aceitas"
        value={stats.aceitas}
        delta={deltas.aceitas}
        trend="up"
        tone="success"
        icon={
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
        }
        caption="vs mês anterior"
      />
      <KpiCard
        label="Recusadas"
        value={stats.recusadas}
        delta={deltas.recusadas}
        trend="down"
        tone="danger"
        icon={<XCircle className="h-4 w-4 text-destructive" />}
        caption="vs mês anterior"
      />
      <KpiCard
        label="Expiradas"
        value={stats.expiradas}
        delta={deltas.expiradas}
        trend="down"
        tone="warning"
        icon={
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
        }
        caption="vs mês anterior"
      />
      <KpiCard
        label="Ganhos Potenciais"
        value={formatCurrency(stats.totalGanhos)}
        delta={deltas.totalGanhos}
        trend="up"
        tone="primary"
        icon={<TrendingUp className="h-4 w-4 text-primary" />}
        caption="vs mês anterior"
      />
    </div>
  );
}
