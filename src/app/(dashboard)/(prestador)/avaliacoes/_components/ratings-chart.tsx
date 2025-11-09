"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, BarChart3, TrendingUp } from "lucide-react";
import { useRatingStats } from "@/hooks/use-ratings";

export function RatingsChart() {
  const { data: ratingStats, isLoading, error } = useRatingStats();

  // Transform stats data for display
  const distributionData = ratingStats
    ? [
        {
          stars: 5,
          count: ratingStats.distribuicao[5],
          percentage: Math.round(
            (ratingStats.distribuicao[5] / ratingStats.totalAvaliacoes) * 100
          ),
          color: "chart-1",
        },
        {
          stars: 4,
          count: ratingStats.distribuicao[4],
          percentage: Math.round(
            (ratingStats.distribuicao[4] / ratingStats.totalAvaliacoes) * 100
          ),
          color: "chart-2",
        },
        {
          stars: 3,
          count: ratingStats.distribuicao[3],
          percentage: Math.round(
            (ratingStats.distribuicao[3] / ratingStats.totalAvaliacoes) * 100
          ),
          color: "chart-3",
        },
        {
          stars: 2,
          count: ratingStats.distribuicao[2],
          percentage: Math.round(
            (ratingStats.distribuicao[2] / ratingStats.totalAvaliacoes) * 100
          ),
          color: "chart-4",
        },
        {
          stars: 1,
          count: ratingStats.distribuicao[1],
          percentage: Math.round(
            (ratingStats.distribuicao[1] / ratingStats.totalAvaliacoes) * 100
          ),
          color: "chart-5",
        },
      ]
    : [];

  const maxCount = Math.max(...distributionData.map((d) => d.count), 1);

  const getStarDisplay = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
        />
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição das Avaliações
          </CardTitle>
          <CardDescription>
            Visualize a distribuição das avaliações recebidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="flex-1 h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-12 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição das Avaliações
          </CardTitle>
          <CardDescription>
            Visualize a distribuição das avaliações recebidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Erro ao carregar dados de avaliações.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ratingStats || ratingStats.totalAvaliacoes === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição das Avaliações
          </CardTitle>
          <CardDescription>
            Visualize a distribuição das avaliações recebidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma avaliação encontrada.
          </div>
        </CardContent>
      </Card>
    );
  }

  const positiveCount = distributionData[0].count + distributionData[1].count;
  const positivePercentage =
    distributionData[0].percentage + distributionData[1].percentage;
  const neutralCount = distributionData[2].count;
  const neutralPercentage = distributionData[2].percentage;
  const negativeCount = distributionData[3].count + distributionData[4].count;
  const negativePercentage =
    distributionData[3].percentage + distributionData[4].percentage;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Distribuição das Avaliações
        </CardTitle>
        <CardDescription>
          Visualize a distribuição das avaliações recebidas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {distributionData.map((item) => {
            const progressValue =
              maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            return (
              <div key={item.stars} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    {getStarDisplay(item.stars)}
                    <span className="text-sm font-medium text-foreground">
                      {item.stars} estrela{item.stars > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground min-w-[2rem] text-right">
                      {item.count}
                    </span>
                    <Badge
                      variant="outline"
                      className="min-w-[3rem] justify-center"
                    >
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-primary/20">
                  <div
                    className="h-full flex-1 transition-all rounded-full"
                    style={{
                      width: `${progressValue}%`,
                      backgroundColor: `var(--${item.color})`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Resumo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avaliações positivas
                </span>
                <Badge
                  variant="default"
                  style={{
                    backgroundColor: "var(--chart-1)",
                    color: "var(--chart-1-foreground, white)",
                  }}
                >
                  4-5★
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {positiveCount}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({positivePercentage}%)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avaliações neutras
                </span>
                <Badge variant="outline">3★</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {neutralCount}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({neutralPercentage}%)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avaliações negativas
                </span>
                <Badge variant="destructive">1-2★</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {negativeCount}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({negativePercentage}%)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Taxa de satisfação
                </span>
                <Badge
                  variant="default"
                  style={{
                    backgroundColor: "var(--chart-2)",
                    color: "var(--chart-2-foreground, white)",
                  }}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--chart-2)" }}
                >
                  {ratingStats.taxaSatisfacao}%
                </span>
                <span className="text-sm text-muted-foreground">positivas</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
