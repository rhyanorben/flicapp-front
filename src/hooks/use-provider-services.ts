"use client";

import { useQuery } from "@tanstack/react-query";

interface ProviderService {
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
  client?: {
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

interface ProviderServiceStats {
  total: number;
  concluidos: number;
  cancelados: number;
  totalFaturado: number;
  avaliacaoMedia: number;
}

async function fetchProviderServices(
  period?: string
): Promise<ProviderService[]> {
  const params = new URLSearchParams();
  if (period && period !== "todos") {
    params.append("period", period);
  }

  const response = await fetch(`/api/provider/services?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch provider services");
  }
  return response.json();
}

async function fetchProviderServiceStats(): Promise<ProviderServiceStats> {
  const response = await fetch("/api/provider/services/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch provider service stats");
  }
  return response.json();
}

export function useProviderServices(period?: string) {
  return useQuery({
    queryKey: ["provider-services", period],
    queryFn: () => fetchProviderServices(period),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useProviderServiceStats() {
  return useQuery({
    queryKey: ["provider-service-stats"],
    queryFn: fetchProviderServiceStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
