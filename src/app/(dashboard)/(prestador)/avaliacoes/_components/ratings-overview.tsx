"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { Star, Users, Award, MessageSquare } from "lucide-react";

export function RatingsOverview() {
  // Dados mockados - em produção viria da API
  const ratingsData = {
    mediaGeral: 4.7,
    totalAvaliacoes: 89,
    distribuicao: {
      5: 52,
      4: 28,
      3: 7,
      2: 2,
      1: 0,
    },
    comentarios: 67,
    avaliacoesRecentes: 12,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Avaliação Média"
        value={ratingsData.mediaGeral.toFixed(1)}
        caption={`${ratingsData.totalAvaliacoes} avaliações`}
        icon={<Star className="h-5 w-5 text-yellow-600" />}
        tone="warning"
        size="md"
      />

      <KpiCard
        label="Total de Avaliações"
        value={ratingsData.totalAvaliacoes}
        delta={`+${ratingsData.avaliacoesRecentes} este mês`}
        trend="up"
        icon={<Users className="h-5 w-5 text-blue-600" />}
        tone="primary"
        size="md"
      />

      <KpiCard
        label="Comentários"
        value={ratingsData.comentarios}
        caption={`${Math.round(
          (ratingsData.comentarios / ratingsData.totalAvaliacoes) * 100
        )}% com comentários`}
        icon={<MessageSquare className="h-5 w-5 text-green-600" />}
        tone="success"
        size="md"
      />

      <KpiCard
        label="Excelência"
        value={`${Math.round(
          ((ratingsData.distribuicao[5] + ratingsData.distribuicao[4]) /
            ratingsData.totalAvaliacoes) *
            100
        )}%`}
        caption="Avaliações 4+ estrelas"
        icon={<Award className="h-5 w-5 text-purple-600" />}
        tone="default"
        size="md"
      />
    </div>
  );
}
