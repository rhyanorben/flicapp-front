"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export function RequestsOverviewCards() {
  // Dados mockados - em produção viria da API
  const stats = {
    pendentes: 8,
    aceitas: 24,
    recusadas: 3,
    expiradas: 1,
    totalGanhos: 2840.0,
  };

  // Dados de variação percentual (vs mês anterior)
  const deltas = {
    pendentes: 8.5, // +8.5% vs mês anterior
    aceitas: 15.3, // +15.3% vs mês anterior
    recusadas: -12.7, // -12.7% vs mês anterior
    expiradas: -18.2, // -18.2% vs mês anterior
    totalGanhos: 7.2, // +7.2% vs mês anterior
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
