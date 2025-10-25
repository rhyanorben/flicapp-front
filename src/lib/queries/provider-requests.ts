"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  submitProviderRequest,
  getProviderRequests,
  updateProviderRequest,
  type ProviderRequestData,
} from "@/lib/api/provider-requests";

export function useSubmitProviderRequest() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitProviderRequest,
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description:
          "Solicitação enviada com sucesso! Aguarde a análise do administrador.",
      });
      queryClient.invalidateQueries({ queryKey: ["provider-requests"] });
      router.push("/dashboard");
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

export function useUpdateProviderRequest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: string;
      action: "approve" | "reject";
    }) => updateProviderRequest(id, action),
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
