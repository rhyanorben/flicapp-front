"use client";

import { useQuery } from "@tanstack/react-query";
import {
  clientMockData,
  providerMockData,
} from "@/app/(dashboard)/dashboard/_data/mock-data";
import { useStatistics } from "./admin";

// Client Dashboard Query
export function useClientDashboard() {
  return useQuery({
    queryKey: ["client-dashboard"],
    queryFn: async () => {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));
      return clientMockData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Provider Dashboard Query
export function useProviderDashboard() {
  return useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: async () => {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));
      return providerMockData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Admin Dashboard Query (reutiliza useStatistics existente)
export function useAdminDashboard() {
  return useStatistics();
}

// Combined hook for role-based dashboard
export function useRoleDashboard(
  role: "CLIENTE" | "PRESTADOR" | "ADMINISTRADOR"
) {
  const clientQuery = useClientDashboard();
  const providerQuery = useProviderDashboard();
  const adminQuery = useAdminDashboard();

  switch (role) {
    case "CLIENTE":
      return {
        data: clientQuery.data,
        isLoading: clientQuery.isLoading,
        error: clientQuery.error,
      };
    case "PRESTADOR":
      return {
        data: providerQuery.data,
        isLoading: providerQuery.isLoading,
        error: providerQuery.error,
      };
    case "ADMINISTRADOR":
      return {
        data: adminQuery.data,
        isLoading: adminQuery.isLoading,
        error: adminQuery.error,
      };
    default:
      return {
        data: null,
        isLoading: false,
        error: new Error("Role não suportada"),
      };
  }
}
