"use client";

import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/lib/api/admin";

interface StatisticsFilters {
  period?: string;
  status?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

async function fetchAdminStatistics(filters?: StatisticsFilters): Promise<any> {
  const params = new URLSearchParams();

  if (filters?.period && filters.period !== "30d") {
    params.append("period", filters.period);
  }

  if (filters?.status && filters.status !== "all") {
    params.append("status", filters.status);
  }

  if (filters?.dateRange?.from && filters?.dateRange?.to) {
    params.append("dateFrom", filters.dateRange.from.toISOString());
    params.append("dateTo", filters.dateRange.to.toISOString());
  }

  const response = await fetch(`/api/admin/statistics?${params.toString()}`);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Acesso negado");
    }
    throw new Error("Erro ao buscar estatísticas");
  }

  return response.json();
}

export function useAdminStatistics(filters?: StatisticsFilters) {
  return useQuery({
    queryKey: ["admin-statistics", filters],
    queryFn: () => fetchAdminStatistics(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}
