"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Reuse types from admin-providers
export type ProviderDetails = {
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
  hasProviderRequest: boolean;
  providerRequestStatus: string | null;
};

export type UpdateProviderData = {
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
};

async function getProviderProfile(): Promise<ProviderDetails> {
  const response = await fetch("/api/provider/profile");

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Acesso negado");
    }
    if (response.status === 404) {
      throw new Error("Perfil não encontrado");
    }
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar perfil do prestador");
  }

  return response.json();
}

async function updateProviderProfile(
  data: UpdateProviderData
): Promise<{ message: string }> {
  const response = await fetch("/api/provider/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar perfil do prestador");
  }

  return response.json();
}

export function useProviderProfile() {
  return useQuery<ProviderDetails, Error>({
    queryKey: ["provider-profile"],
    queryFn: getProviderProfile,
  });
}

export function useUpdateProviderProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    UpdateProviderData
  >({
    mutationFn: updateProviderProfile,
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Informações do prestador atualizadas com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
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

