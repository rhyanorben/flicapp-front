"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  submitProviderRequest,
  getProviderRequests,
  getUserOwnProviderRequests,
  updateProviderRequest,
} from "@/lib/api/provider-requests";

export function useSubmitProviderRequest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitProviderRequest,
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description:
          "Solicitação enviada com sucesso! Aguarde a análise do administrador.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-provider-requests"] });
      queryClient.invalidateQueries({ queryKey: ["provider-requests"] });
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

export function useProviderRequests() {
  return useQuery({
    queryKey: ["provider-requests"],
    queryFn: getProviderRequests,
  });
}

export function useUserProviderRequests() {
  return useQuery({
    queryKey: ["user-provider-requests"],
    queryFn: getUserOwnProviderRequests,
  });
}

export function useUpdateProviderRequest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      action,
      rejectionReason,
    }: {
      id: string;
      action: "approve" | "reject";
      rejectionReason?: string;
    }) => updateProviderRequest(id, action, rejectionReason),
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["provider-requests"] });
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
