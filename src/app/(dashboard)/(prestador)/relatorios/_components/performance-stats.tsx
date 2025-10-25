"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { Star, Clock, CheckCircle, Users, Award, Zap } from "lucide-react";

export function PerformanceStats() {
  // Dados mockados - em produção viria da API
  const performanceData = {
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 89,
    taxaConclusao: 94.2,
    tempoMedioResposta: 2.5,
    clientesRecorrentes: 23,
    servicosCancelados: 3,
  };

  // Dados de variação percentual (vs mês anterior)
  const deltas = {
    avaliacaoMedia: 1.2, // +1.2% vs mês anterior
    taxaConclusao: 0.8, // +0.8% vs mês anterior
    tempoMedioResposta: -8.3, // -8.3% vs mês anterior (melhoria)
    clientesRecorrentes: 6.7, // +6.7% vs mês anterior
    eficiencia: 2.1, // +2.1% vs mês anterior
    servicosCancelados: -12.5, // -12.5% vs mês anterior (melhoria)
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Estatísticas de Desempenho</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Avaliação Média"
          value={performanceData.avaliacaoMedia.toFixed(1)}
          delta={deltas.avaliacaoMedia}
          trend="up"
          tone="warning"
          icon={<Star className="h-4 w-4 text-amber-600 dark:text-amber-300" />}
          caption={`${performanceData.totalAvaliacoes} avaliações`}
        />
        <KpiCard
          label="Taxa de Conclusão"
          value={`${performanceData.taxaConclusao}%`}
          delta={deltas.taxaConclusao}
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
          delta={deltas.tempoMedioResposta}
          trend="down"
          tone="primary"
          icon={<Clock className="h-4 w-4 text-primary" />}
          caption="vs mês anterior (melhoria)"
        />
        <KpiCard
          label="Clientes Recorrentes"
          value={performanceData.clientesRecorrentes}
          delta={deltas.clientesRecorrentes}
          trend="up"
          tone="primary"
          icon={<Users className="h-4 w-4 text-primary" />}
          caption="vs mês anterior"
        />
        <KpiCard
          label="Eficiência"
          value="92%"
          delta={deltas.eficiencia}
          trend="up"
          tone="warning"
          icon={<Zap className="h-4 w-4 text-amber-600 dark:text-amber-300" />}
          caption="vs mês anterior"
        />
        <KpiCard
          label="Cancelamentos"
          value={performanceData.servicosCancelados}
          delta={deltas.servicosCancelados}
          trend="down"
          tone="danger"
          icon={<Award className="h-4 w-4 text-destructive" />}
          caption="vs mês anterior (melhoria)"
        />
      </div>
    </div>
  );
}
