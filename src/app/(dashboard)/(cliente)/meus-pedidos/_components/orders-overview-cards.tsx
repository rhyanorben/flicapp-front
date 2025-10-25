"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface OrderStats {
  total: number;
  aguardando: number;
  emAndamento: number;
  concluidos: number;
  cancelados: number;
}

interface OrderDeltas {
  total: number;
  aguardando: number;
  emAndamento: number;
  concluidos: number;
  cancelados: number;
}

export function OrdersOverviewCards() {
  // Dados mockados - em produção viria da API
  const stats: OrderStats = {
    total: 12,
    aguardando: 3,
    emAndamento: 2,
    concluidos: 6,
    cancelados: 1,
  };

  // Dados de variação percentual (vs mês anterior)
  const deltas: OrderDeltas = {
    total: 12.5, // +12.5% vs mês anterior
    aguardando: -15.2, // -15.2% vs mês anterior
    emAndamento: 8.3, // +8.3% vs mês anterior
    concluidos: 18.7, // +18.7% vs mês anterior
    cancelados: -22.1, // -22.1% vs mês anterior
  };

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
