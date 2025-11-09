"use client";

import { useQuery } from "@tanstack/react-query";

interface StatisticsFilters {
  period?: string;
  status?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface AdminStatistics {
  users: {
    total: number;
    admins: number;
    providers: number;
    clients: number;
    byMonth: {
      [month: string]: number;
    };
  };
  providerRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byMonth: {
      [month: string]: number;
    };
    byStatusAndMonth: {
      [month: string]: {
        pending: number;
        approved: number;
        rejected: number;
      };
    };
    recent: Array<{
      id: string;
      userId: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
      status: string;
      createdAt: string;
    }>;
  };
  activities?: Array<{
    id: string;
    type:
      | "user_registered"
      | "request_approved"
      | "request_rejected"
      | "request_pending"
      | "system_alert";
    title: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}

async function fetchAdminStatistics(
  filters?: StatisticsFilters
): Promise<AdminStatistics> {
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
