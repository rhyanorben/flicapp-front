"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface ProviderDetails {
  id: string;
  name: string;
  email: string;
  phoneE164: string | null;
  roles: string[];
  providerProfile: {
    bio: string | null;
    radiusKm: number;
    avgRating: number;
    totalReviews: number;
    acceptRate30d: number;
    responseP50S: number;
    noShow30d: number;
  } | null;
  providerCategories: Array<{
    id: string;
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    minPriceCents: number;
    active: boolean;
    isAvailable: boolean | null;
    levelWeight: number | null;
    expWeight: number | null;
    score: number | null;
    updatedAt: string;
  }>;
  activeAddress: {
    id: string;
    label: string | null;
    cep: string | null;
    street: string | null;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    lat: number | null;
    lon: number | null;
    active: boolean;
    createdAt: string;
  } | null;
}

export interface UpdateProviderData {
  profile?: {
    bio?: string;
    radiusKm?: number;
  };
  categories?: Array<{
    id: string;
    minPriceCents?: number;
    active?: boolean;
    isAvailable?: boolean;
  }>;
  address?: {
    label?: string;
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    lat?: number;
    lon?: number;
  };
  phone?: string;
}

async function getProviderDetails(userId: string): Promise<ProviderDetails> {
  const response = await fetch(`/api/admin/users/${userId}`);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Acesso negado");
    }
    if (response.status === 404) {
      throw new Error("Usuário não encontrado");
    }
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar detalhes do prestador");
  }

  return response.json();
}

async function updateProvider(
  providerId: string,
  data: UpdateProviderData
): Promise<{ message: string }> {
  const response = await fetch(`/api/admin/providers/${providerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar informações do prestador");
  }

  return response.json();
}

export function useProviderDetails(userId: string | null) {
  return useQuery({
    queryKey: ["provider-details", userId],
    queryFn: () => getProviderDetails(userId!),
    enabled: !!userId,
  });
}

export function useUpdateProvider() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      providerId,
      data,
    }: {
      providerId: string;
      data: UpdateProviderData;
    }) => updateProvider(providerId, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Sucesso",
        description: "Informações do prestador atualizadas com sucesso",
      });
      queryClient.invalidateQueries({
        queryKey: ["provider-details", variables.providerId],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

