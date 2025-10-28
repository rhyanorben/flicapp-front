"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { Star, Users, Award, MessageSquare } from "lucide-react";
import { useRatingStats } from "@/hooks/use-ratings";

export function RatingsOverview() {
  const { data: ratingStats, isLoading, error } = useRatingStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
        Erro ao carregar estatísticas de avaliações.
      </div>
    );
  }

  if (!ratingStats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma estatística disponível.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Avaliação Média"
        value={ratingStats.mediaGeral.toFixed(1)}
        caption={`${ratingStats.totalAvaliacoes} avaliações`}
        icon={<Star className="h-5 w-5 text-yellow-600" />}
        tone="warning"
        size="md"
      />

      <KpiCard
        label="Total de Avaliações"
        value={ratingStats.totalAvaliacoes}
        delta={`+${ratingStats.avaliacoesRecentes} este mês`}
        trend="up"
        icon={<Users className="h-5 w-5 text-blue-600" />}
        tone="primary"
        size="md"
      />

      <KpiCard
        label="Comentários"
        value={ratingStats.comentarios}
        caption={`${Math.round(
          (ratingStats.comentarios / ratingStats.totalAvaliacoes) * 100
        )}% com comentários`}
        icon={<MessageSquare className="h-5 w-5 text-green-600" />}
        tone="success"
        size="md"
      />

      <KpiCard
        label="Excelência"
        value={`${ratingStats.taxaExcelencia}%`}
        caption="Avaliações 4+ estrelas"
        icon={<Award className="h-5 w-5 text-purple-600" />}
        tone="default"
        size="md"
      />
    </div>
  );
}
