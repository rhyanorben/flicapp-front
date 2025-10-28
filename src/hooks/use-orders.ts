"use client";

import { useQuery } from "@tanstack/react-query";

interface Order {
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

interface OrderStats {
  total: number;
  aguardando: number;
  emAndamento: number;
  concluidos: number;
  cancelados: number;
}

interface OrderDeltas {
  total: number;
  aguardando: number;
  emAndamento: number;
  concluidos: number;
  cancelados: number;
}

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

async function fetchOrderStats(): Promise<{
  stats: OrderStats;
  deltas: OrderDeltas;
}> {
  const response = await fetch("/api/orders/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch order stats");
  }
  return response.json();
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["order-stats"],
    queryFn: fetchOrderStats,
    staleTime: 60 * 1000, // 1 minute
  });
}
