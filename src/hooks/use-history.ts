"use client";

import { useQuery } from "@tanstack/react-query";

interface HistoryOrder {
  id: string;
  clientId: string;
  providerId: string | null;
  addressId: string | null;
  categoryId: string | null;
  description: string;
  status: string;
  depositMethod: string;
  depositBaseAvgCents: number | null;
  depositCents: number;
  slotStart: string | null;
  slotEnd: string | null;
  finalPriceCents: number | null;
  reviewStatus: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string | null;
  };
  address?: {
    id: string;
    street: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    number: string | null;
  };
  orderReview?: {
    rating: number | null;
    comment: string | null;
  };
}

interface HistoryStats {
  total: number;
  concluidos: number;
  cancelados: number;
  totalGasto: number;
  avaliacaoMedia: number;
}

async function fetchHistoryOrders(period?: string): Promise<HistoryOrder[]> {
  const params = new URLSearchParams();
  if (period && period !== "todos") {
    params.append("period", period);
  }

  const response = await fetch(`/api/orders/history?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch history orders");
  }
  return response.json();
}

async function fetchHistoryStats(): Promise<HistoryStats> {
  const response = await fetch("/api/orders/history/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch history stats");
  }
  return response.json();
}

export function useHistoryOrders(period?: string) {
  return useQuery({
    queryKey: ["history-orders", period],
    queryFn: () => fetchHistoryOrders(period),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useHistoryStats() {
  return useQuery({
    queryKey: ["history-stats"],
    queryFn: fetchHistoryStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
