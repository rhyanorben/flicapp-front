"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface Rating {
  id: string;
  orderId: string;
  clientId: string;
  providerId: string;
  rating: number | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    description: string;
    createdAt: string;
    category?: {
      name: string;
      slug: string;
    };
    client: {
      id: string;
      name: string;
      email: string | null;
      image: string | null;
    };
  };
}

interface RatingStats {
  mediaGeral: number;
  totalAvaliacoes: number;
  distribuicao: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  comentarios: number;
  avaliacoesRecentes: number;
  taxaSatisfacao: number;
  taxaExcelencia: number;
}

async function fetchRatings(
  period: string = "todos",
  rating: string = "todos"
): Promise<Rating[]> {
  const response = await fetch(
    `/api/provider/ratings?period=${period}&rating=${rating}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch ratings");
  }
  return response.json();
}

async function fetchRatingStats(): Promise<RatingStats> {
  const response = await fetch("/api/provider/ratings/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch rating stats");
  }
  return response.json();
}

export function useRatings(period: string = "todos", rating: string = "todos") {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  return useQuery<Rating[], Error>({
    queryKey: ["ratings", userId, period, rating],
    queryFn: () => fetchRatings(period, rating),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRatingStats() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  return useQuery<RatingStats, Error>({
    queryKey: ["rating-stats", userId],
    queryFn: fetchRatingStats,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
