"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/api/auth";
import { authClient } from "@/lib/auth-client";

export function useRegister() {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async (_, variables) => {
      toast({
        title: "Sucesso",
        description: "Cadastro realizado com sucesso!",
      });

      // Auto-login after successful registration
      try {
        await authClient.signIn.email(
          {
            email: variables.email,
            password: variables.password,
          },
          {
            onSuccess: () => {
              router.replace("/dashboard");
            },
            onError: () => {
              toast({
                title: "Aviso",
                description:
                  "Cadastrado com sucesso, mas houve erro no login. Por favor, faça login manualmente.",
                variant: "destructive",
              });
              router.replace("/login");
            },
          }
        );
      } catch {
        toast({
          title: "Aviso",
          description:
            "Cadastrado com sucesso, mas houve erro no login. Por favor, faça login manualmente.",
          variant: "destructive",
        });
        router.replace("/login");
      }
    },
    onError: () => {
      // Erros são tratados no formulário usando form.setError()
    },
  });
}
