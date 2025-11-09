"use client";

import { useState } from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Target } from "lucide-react";
import { useFinancialData } from "@/hooks/use-reports";

export function FinancialStats() {
  const [period, setPeriod] = useState("mes");
  const { data: financialData, isLoading, error } = useFinancialData(period);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getTrend = (change: number): "up" | "down" | "flat" => {
    if (change > 0) return "up";
    if (change < 0) return "down";
    return "flat";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Estatísticas Financeiras</h2>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-muted rounded animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border bg-background animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20" />
                  <div className="h-8 bg-muted rounded w-16" />
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Estatísticas Financeiras</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Erro ao carregar dados financeiros.
        </div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Estatísticas Financeiras</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado financeiro disponível.
        </div>
      </div>
    );
  }

  const totalGanhosTrend = getTrend(financialData.totalGanhosChange);
  const servicosTrend = getTrend(financialData.servicosChange);
  const ticketTrend = getTrend(financialData.ticketChange);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Estatísticas Financeiras</h2>
        <div className="flex gap-2">
          <Button
            variant={period === "mes" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("mes")}
          >
            Este Mês
          </Button>
          <Button
            variant={period === "trimestre" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("trimestre")}
          >
            Este Trimestre
          </Button>
          <Button
            variant={period === "ano" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("ano")}
          >
            Este Ano
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total de Ganhos"
          value={formatCurrency(financialData.totalGanhos)}
          delta={financialData.totalGanhosChange}
          trend={totalGanhosTrend}
          tone="success"
          icon={
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          }
          caption="vs período anterior"
        />
        <KpiCard
          label="Serviços Realizados"
          value={financialData.servicosRealizados}
          delta={financialData.servicosChange}
          trend={servicosTrend}
          tone="primary"
          icon={<Target className="h-4 w-4 text-primary" />}
          caption="vs período anterior"
        />
        <KpiCard
          label="Ticket Médio"
          value={formatCurrency(financialData.ticketMedio)}
          delta={financialData.ticketChange}
          trend={ticketTrend}
          tone="primary"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          caption="vs período anterior"
        />
      </div>
    </div>
  );
}
