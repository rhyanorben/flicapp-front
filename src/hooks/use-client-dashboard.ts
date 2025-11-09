"use client";

import { useQuery } from "@tanstack/react-query";

interface Order {
  id: string;
  service: string;
  provider: string;
  status: "IN_PROGRESS" | "COMPLETED" | "PENDING";
  createdAt: string;
}

interface Provider {
  name: string;
  rating: number;
  services: number;
}

interface Schedule {
  id: string;
  service: string;
  provider: string;
  time: string;
}

interface ClientDashboardData {
  services: {
    total: number;
    inProgress: number;
    completed: number;
    favorites: number;
  };
  monthlyRequests: Record<string, number>;
  categoriesDistribution: Record<string, number>;
  recentOrders: Order[];
  favoriteProviders: Provider[];
  upcomingSchedules: Schedule[];
  pendingReviews: number;
  tips: string[];
}

async function fetchClientDashboard(): Promise<ClientDashboardData> {
  const response = await fetch("/api/dashboard/client");
  if (!response.ok) {
    throw new Error("Failed to fetch client dashboard data");
  }
  return response.json();
}

export function useClientDashboard() {
  return useQuery({
    queryKey: ["client-dashboard"],
    queryFn: fetchClientDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}
