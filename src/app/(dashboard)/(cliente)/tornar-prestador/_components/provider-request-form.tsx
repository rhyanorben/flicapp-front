"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const providerRequestSchema = z.object({
  description: z.string().min(20, { 
    message: "A descrição deve ter pelo menos 20 caracteres" 
  }),
  experience: z.string().min(50, { 
    message: "Descreva sua experiência com pelo menos 50 caracteres" 
  }),
  phone: z.string().min(10, { 
    message: "Digite um telefone válido" 
  }),
  address: z.string().min(10, { 
    message: "Digite um endereço válido" 
  }),
  documentNumber: z.string().min(11, { 
    message: "Digite um CPF ou CNPJ válido" 
  }),
  portfolioLinks: z.string().optional(),
});

type ProviderRequestFormValues = z.infer<typeof providerRequestSchema>;

export function ProviderRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProviderRequestFormValues>({
    resolver: zodResolver(providerRequestSchema),
    defaultValues: {
      description: "",
      experience: "",
      phone: "",
      address: "",
      documentNumber: "",
      portfolioLinks: "",
    },
  });

  async function onSubmit(formData: ProviderRequestFormValues) {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/provider-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar solicitação");
      }

      alert("Solicitação enviada com sucesso! Aguarde a análise do administrador.");
      router.push("/dashboard");
    } catch (error: any) {
      alert(error?.message || "Erro ao enviar solicitação");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição dos Serviços</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os serviços que você pretende oferecer..."
                  {...field} 
                  disabled={isLoading}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Informe os tipos de serviços que você pode realizar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experiência Profissional</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Conte-nos sobre sua experiência profissional, anos de atuação, projetos realizados..."
                  {...field} 
                  disabled={isLoading}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Descreva sua experiência na área de atuação
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Rua, número, bairro, cidade - UF" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF ou CNPJ</FormLabel>
              <FormControl>
                <Input 
                  placeholder="000.000.000-00 ou 00.000.000/0000-00" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolioLinks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Links de Portfólio (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Cole aqui links para seu portfólio, redes sociais profissionais, etc. (um por linha)"
                  {...field} 
                  disabled={isLoading}
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Links que demonstrem seu trabalho (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar Solicitação"
          )}
        </Button>
      </form>
    </Form>
  );
}

