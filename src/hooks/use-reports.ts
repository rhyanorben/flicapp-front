"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface FinancialData {
  totalGanhos: number;
  ganhosAnterior: number;
  servicosRealizados: number;
  servicosAnterior: number;
  ticketMedio: number;
  ticketAnterior: number;
  totalGanhosChange: number;
  servicosChange: number;
  ticketChange: number;
}

interface PerformanceData {
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  taxaConclusao: number;
  tempoMedioResposta: number;
  clientesRecorrentes: number;
  servicosCancelados: number;
  eficiencia: number;
  deltas: {
    avaliacaoMedia: number;
    taxaConclusao: number;
    tempoMedioResposta: number;
    clientesRecorrentes: number;
    eficiencia: number;
    servicosCancelados: number;
  };
}

interface ChartData {
  type: string;
  data: Array<{
    mes?: string;
    valor?: number;
    quantidade?: number;
    tipo?: string;
    porcentagem?: number;
  }>;
}

async function fetchFinancialData(period: string): Promise<FinancialData> {
  const response = await fetch(
    `/api/provider/reports/financial?period=${period}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch financial data");
  }
  return response.json();
}

async function fetchPerformanceData(): Promise<PerformanceData> {
  const response = await fetch("/api/provider/reports/performance");
  if (!response.ok) {
    throw new Error("Failed to fetch performance data");
  }
  return response.json();
}

async function fetchChartData(chartType: string): Promise<ChartData> {
  const response = await fetch(
    `/api/provider/reports/charts?type=${chartType}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }
  return response.json();
}

export function useFinancialData(period: string = "mes") {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  return useQuery<FinancialData, Error>({
    queryKey: ["financial-data", userId, period],
    queryFn: () => fetchFinancialData(period),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePerformanceData() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  return useQuery<PerformanceData, Error>({
    queryKey: ["performance-data", userId],
    queryFn: fetchPerformanceData,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useChartData(chartType: string) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  return useQuery<ChartData, Error>({
    queryKey: ["chart-data", userId, chartType],
    queryFn: () => fetchChartData(chartType),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
