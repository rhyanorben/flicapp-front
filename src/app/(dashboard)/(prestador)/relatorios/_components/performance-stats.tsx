"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { Star, Clock, CheckCircle, Users, Award, Zap } from "lucide-react";
import { usePerformanceData } from "@/hooks/use-reports";

export function PerformanceStats() {
  const { data: performanceData, isLoading, error } = usePerformanceData();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Estatísticas de Desempenho</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Estatísticas de Desempenho</h2>
        <div className="text-center py-8 text-muted-foreground">
          Erro ao carregar dados de desempenho.
        </div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Estatísticas de Desempenho</h2>
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado de desempenho disponível.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Estatísticas de Desempenho</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Avaliação Média"
          value={performanceData.avaliacaoMedia.toFixed(1)}
          delta={performanceData.deltas.avaliacaoMedia}
          trend="up"
          tone="warning"
          icon={<Star className="h-4 w-4 text-amber-600 dark:text-amber-300" />}
          caption={`${performanceData.totalAvaliacoes} avaliações`}
        />
        <KpiCard
          label="Taxa de Conclusão"
          value={`${performanceData.taxaConclusao}%`}
          delta={performanceData.deltas.taxaConclusao}
          trend="up"
          tone="success"
          icon={
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          }
          caption="vs mês anterior"
        />
        <KpiCard
          label="Tempo Médio de Resposta"
          value={`${performanceData.tempoMedioResposta}h`}
          delta={performanceData.deltas.tempoMedioResposta}
          trend="down"
          tone="primary"
          icon={<Clock className="h-4 w-4 text-primary" />}
          caption="vs mês anterior (melhoria)"
        />
        <KpiCard
          label="Clientes Recorrentes"
          value={performanceData.clientesRecorrentes}
          delta={performanceData.deltas.clientesRecorrentes}
          trend="up"
          tone="primary"
          icon={<Users className="h-4 w-4 text-primary" />}
          caption="vs mês anterior"
        />
        <KpiCard
          label="Eficiência"
          value={`${performanceData.eficiencia}%`}
          delta={performanceData.deltas.eficiencia}
          trend="up"
          tone="warning"
          icon={<Zap className="h-4 w-4 text-amber-600 dark:text-amber-300" />}
          caption="vs mês anterior"
        />
        <KpiCard
          label="Cancelamentos"
          value={performanceData.servicosCancelados}
          delta={performanceData.deltas.servicosCancelados}
          trend="down"
          tone="danger"
          icon={<Award className="h-4 w-4 text-destructive" />}
          caption="vs mês anterior (melhoria)"
        />
      </div>
    </div>
  );
}
