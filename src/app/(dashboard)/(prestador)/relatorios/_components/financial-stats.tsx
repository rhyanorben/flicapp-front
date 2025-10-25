"use client";

import { useState } from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Target } from "lucide-react";

export function FinancialStats() {
  const [period, setPeriod] = useState("mes");

  // Dados mockados - em produção viria da API
  const financialData = {
    mes: {
      totalGanhos: 2840.0,
      ganhosAnterior: 2650.0,
      servicosRealizados: 18,
      servicosAnterior: 15,
      ticketMedio: 157.78,
      ticketAnterior: 176.67,
    },
    trimestre: {
      totalGanhos: 8520.0,
      ganhosAnterior: 7950.0,
      servicosRealizados: 54,
      servicosAnterior: 48,
      ticketMedio: 157.78,
      ticketAnterior: 165.63,
    },
    ano: {
      totalGanhos: 34160.0,
      ganhosAnterior: 31800.0,
      servicosRealizados: 216,
      servicosAnterior: 192,
      ticketMedio: 158.15,
      ticketAnterior: 165.63,
    },
  };

  const currentData = financialData[period as keyof typeof financialData];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getPercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    // Limitar a 2 casas decimais para valores mais legíveis
    return Math.round(change * 100) / 100;
  };

  const getTrend = (change: number): "up" | "down" | "flat" => {
    if (change > 0) return "up";
    if (change < 0) return "down";
    return "flat";
  };

  const totalGanhosChange = getPercentageChange(
    currentData.totalGanhos,
    currentData.ganhosAnterior
  );
  const servicosChange = getPercentageChange(
    currentData.servicosRealizados,
    currentData.servicosAnterior
  );
  const ticketChange = getPercentageChange(
    currentData.ticketMedio,
    currentData.ticketAnterior
  );

  const totalGanhosTrend = getTrend(totalGanhosChange);
  const servicosTrend = getTrend(servicosChange);
  const ticketTrend = getTrend(ticketChange);

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
          value={formatCurrency(currentData.totalGanhos)}
          delta={totalGanhosChange}
          trend={totalGanhosTrend}
          tone="success"
          icon={
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          }
          caption="vs período anterior"
        />
        <KpiCard
          label="Serviços Realizados"
          value={currentData.servicosRealizados}
          delta={servicosChange}
          trend={servicosTrend}
          tone="primary"
          icon={<Target className="h-4 w-4 text-primary" />}
          caption="vs período anterior"
        />
        <KpiCard
          label="Ticket Médio"
          value={formatCurrency(currentData.ticketMedio)}
          delta={ticketChange}
          trend={ticketTrend}
          tone="primary"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          caption="vs período anterior"
        />
      </div>
    </div>
  );
}
