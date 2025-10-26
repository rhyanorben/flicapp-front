"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Target } from "lucide-react";

interface MetricsProgressProps {
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

export function MetricsProgress({ data }: MetricsProgressProps) {
  // Calculate metrics
  const approvalRate =
    data.providerRequests.total > 0
      ? (data.providerRequests.approved / data.providerRequests.total) * 100
      : 0;

  const pendingRate =
    data.providerRequests.total > 0
      ? (data.providerRequests.pending / data.providerRequests.total) * 100
      : 0;

  const providerRatio =
    data.users.total > 0 ? (data.users.providers / data.users.total) * 100 : 0;

  const metrics = [
    {
      label: "Taxa de Aprovação",
      value: approvalRate,
      target: 80,
      icon: <CheckCircle className="h-4 w-4" />,
      color:
        approvalRate >= 80
          ? "text-green-600"
          : approvalRate >= 60
          ? "text-yellow-600"
          : "text-red-600",
      bgColor:
        approvalRate >= 80
          ? "bg-green-100"
          : approvalRate >= 60
          ? "bg-yellow-100"
          : "bg-red-100",
    },
    {
      label: "Solicitações Pendentes",
      value: pendingRate,
      target: 20, // Target: less than 20% pending
      icon: <Clock className="h-4 w-4" />,
      color:
        pendingRate <= 20
          ? "text-green-600"
          : pendingRate <= 40
          ? "text-yellow-600"
          : "text-red-600",
      bgColor:
        pendingRate <= 20
          ? "bg-green-100"
          : pendingRate <= 40
          ? "bg-yellow-100"
          : "bg-red-100",
    },
    {
      label: "Proporção de Prestadores",
      value: providerRatio,
      target: 30, // Target: 30% of users should be providers
      icon: <Target className="h-4 w-4" />,
      color:
        providerRatio >= 30
          ? "text-green-600"
          : providerRatio >= 20
          ? "text-yellow-600"
          : "text-red-600",
      bgColor:
        providerRatio >= 30
          ? "bg-green-100"
          : providerRatio >= 20
          ? "bg-yellow-100"
          : "bg-red-100",
    },
  ];

  const getStatusBadge = (value: number, target: number, isReverse = false) => {
    const isGood = isReverse ? value <= target : value >= target;
    const isWarning = isReverse ? value <= target * 1.5 : value >= target * 0.5;

    if (isGood)
      return (
        <Badge className="bg-green-100 text-green-800">Meta atingida</Badge>
      );
    if (isWarning)
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Próximo da meta</Badge>
      );
    return <Badge className="bg-red-100 text-red-800">Abaixo da meta</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Performance</CardTitle>
        <CardDescription>Indicadores de qualidade e metas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${metric.bgColor}`}>
                    {metric.icon}
                  </div>
                  <span className="font-medium text-sm">{metric.label}</span>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${metric.color}`}>
                    {metric.value.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Meta: {metric.target}%
                  </div>
                </div>
              </div>

              <Progress value={metric.value} className="h-2" />

              <div className="flex items-center justify-between">
                {getStatusBadge(
                  metric.value,
                  metric.target,
                  metric.label.includes("Pendentes")
                )}
                <div className="text-xs text-muted-foreground">
                  {metric.value.toFixed(1)}% / {metric.target}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Resumo</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {approvalRate >= 80 && pendingRate <= 20 && providerRatio >= 30
              ? "Todas as metas foram atingidas! 🎉"
              : "Algumas métricas precisam de atenção para atingir as metas."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
