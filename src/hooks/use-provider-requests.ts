"use client";

import { useQuery } from "@tanstack/react-query";

interface ProviderRequest {
  // OrderInvitation fields
  invitationId: string;
  respondedAt: string | null;
  response: string | null;
  expiresAt: string | null;
  sentAt: string;
  status: string | null; // OrderInvitation status
  // Order fields (for compatibility)
  id: string;
  clientId: string;
  providerId: string | null;
  addressId: string | null;
  categoryId: string | null;
  description: string;
  depositMethod: string;
  depositBaseAvgCents: number | null;
  depositCents: number;
  slotStart: string | null;
  slotEnd: string | null;
  finalPriceCents: number | null;
  reviewStatus: string | null;
  orderStatus: string; // Order status for mapping
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
}

interface ProviderRequestStats {
  pendentes: number;
  aceitas: number;
  recusadas: number;
  expiradas: number;
  totalGanhos: number;
}

interface RequestDeltas {
  pendentes: number;
  aceitas: number;
  recusadas: number;
  expiradas: number;
  totalGanhos: number;
}

async function fetchProviderRequests(): Promise<ProviderRequest[]> {
  const response = await fetch("/api/provider/requests");
  if (!response.ok) {
    throw new Error("Failed to fetch provider requests");
  }
  return response.json();
}

async function fetchProviderRequestStats(): Promise<{
  stats: ProviderRequestStats;
  deltas: RequestDeltas;
}> {
  const response = await fetch("/api/provider/requests/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch provider request stats");
  }
  return response.json();
}

export function useProviderRequests() {
  return useQuery({
    queryKey: ["provider-requests"],
    queryFn: fetchProviderRequests,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useProviderRequestStats() {
  return useQuery({
    queryKey: ["provider-request-stats"],
    queryFn: fetchProviderRequestStats,
    staleTime: 60 * 1000, // 1 minute
  });
}
