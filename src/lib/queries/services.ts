"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { submitServiceRequest } from "@/lib/api/services";

export function useSubmitServiceRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: submitServiceRequest,
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message,
      });
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
