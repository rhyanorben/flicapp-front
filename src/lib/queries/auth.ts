"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/api/auth";

export function useRegister() {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      toast({
        title: "Sucesso",
        description: "Cadastro realizado com sucesso! Verifique seu email.",
      });

      // Redirecionar para página de verificação de email
      // O userId deve vir na resposta do registro
      const userId = (data as { user?: { id?: string } })?.user?.id;
      if (userId) {
        router.replace(`/verify-email?userId=${userId}`);
      } else {
        // Se não tiver userId na resposta, tentar buscar pelo email
        // ou redirecionar para login com mensagem
        toast({
          title: "Aviso",
          description:
            "Cadastrado com sucesso. Por favor, verifique seu email e faça login.",
          variant: "default",
        });
        router.replace("/login");
      }
    },
    onError: () => {
      // Erros são tratados no formulário usando form.setError()
    },
  });
}
