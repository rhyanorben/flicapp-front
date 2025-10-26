"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useSubmitProviderRequest } from "@/lib/queries/provider-requests";
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/utils/phone-mask";
import {
  formatDocument,
  validateDocument,
} from "@/lib/utils/document-validation";
import { formatCEP, validateCEP, fetchAddressByCEP } from "@/lib/utils/viacep";
import { ServiceSelection as ServiceSelectionComponent } from "./service-selection";
import { PortfolioLinks } from "./portfolio-links";

const providerRequestSchema = z.object({
  services: z
    .array(
      z.object({
        serviceType: z.enum([
          "eletricista",
          "encanador",
          "limpeza-residencial",
          "suporte-de-informatica",
          "montador-de-moveis",
          "chaveiro",
          "pintor",
          "pedreiro-reforma",
          "marceneiro",
          "jardinagem",
          "piscineiro",
          "dedetizacao",
          "gesseiro",
          "serralheiro",
          "vidraceiro",
          "instalador-ar-condicionado",
          "manutencao-eletrodomesticos",
          "mecanico-automotivo",
          "funilaria-automotiva",
          "transporte-frete",
          "mudanca-carretos",
          "cuidador-idosos",
          "baba",
          "professor-particular",
          "personal-trainer",
          "fotografo-filmagem",
          "designer-grafico",
          "cabeleireiro",
          "manicure-pedicure",
          "maquiagem",
          "buffet",
          "dj-som",
          "decoracao-eventos",
          "outros",
        ] as const),
        experienceLevel: z.enum([
          "iniciante",
          "intermediario",
          "avancado",
          "especialista",
        ] as const),
        customService: z.string().optional(),
      })
    )
    .min(1, "Selecione pelo menos um serviço"),
  description: z
    .string()
    .min(20, {
      message: "A descrição deve ter pelo menos 20 caracteres",
    })
    .max(500, {
      message: "A descrição deve ter no máximo 500 caracteres",
    }),
  experience: z
    .string()
    .min(50, {
      message: "Descreva sua experiência com pelo menos 50 caracteres",
    })
    .max(1000, {
      message: "A experiência deve ter no máximo 1000 caracteres",
    }),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine((phone) => validatePhoneNumber(phone), {
      message: "Digite um telefone válido com 11 dígitos",
    }),
  cep: z
    .string()
    .min(1, "CEP é obrigatório")
    .refine((cep) => validateCEP(cep), {
      message: "Digite um CEP válido com 8 dígitos",
    }),
  address: z
    .string()
    .min(10, {
      message: "Digite um endereço válido",
    })
    .max(200, {
      message: "O endereço deve ter no máximo 200 caracteres",
    }),
  documentNumber: z
    .string()
    .min(1, "CPF ou CNPJ é obrigatório")
    .refine((doc) => validateDocument(doc), {
      message: "Digite um CPF ou CNPJ válido",
    }),
  portfolioLinks: z
    .array(
      z.object({
        url: z
          .string()
          .url("Digite uma URL válida")
          .max(200, "Cada link deve ter no máximo 200 caracteres"),
        title: z
          .string()
          .min(1, "Título é obrigatório")
          .max(50, "Título deve ter no máximo 50 caracteres"),
      })
    )
    .max(5, "Máximo 5 links de portfólio")
    .optional(),
});

type ProviderRequestFormValues = z.infer<typeof providerRequestSchema>;

export function ProviderRequestForm() {
  const submitProviderRequest = useSubmitProviderRequest();

  const form = useForm<ProviderRequestFormValues>({
    resolver: zodResolver(providerRequestSchema),
    defaultValues: {
      services: [],
      description: "",
      experience: "",
      phone: "",
      cep: "",
      address: "",
      documentNumber: "",
      portfolioLinks: [],
    },
  });

  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value);
    form.setValue("documentNumber", formatted);

    // Clear previous error
    setDocumentError(null);

    // Validate if document is complete
    const numbers = formatted.replace(/\D/g, "");
    if (numbers.length === 11 || numbers.length === 14) {
      if (!validateDocument(formatted)) {
        setDocumentError("CPF ou CNPJ inválido");
      }
    }
  };

  const handleCEPChange = async (cep: string) => {
    const formattedCEP = formatCEP(cep);
    form.setValue("cep", formattedCEP);

    if (validateCEP(formattedCEP)) {
      setIsLoadingCEP(true);
      try {
        const addressData = await fetchAddressByCEP(formattedCEP);
        if (addressData) {
          const fullAddress = `${addressData.street}, ${addressData.neighborhood}, ${addressData.city} - ${addressData.state}`;
          form.setValue("address", fullAddress);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        // Não limpa o campo de endereço se houver erro
      } finally {
        setIsLoadingCEP(false);
      }
    }
  };

  function onSubmit(formData: ProviderRequestFormValues) {
    submitProviderRequest.mutate(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviços que você oferece *</FormLabel>
              <FormControl>
                <ServiceSelectionComponent
                  services={field.value}
                  onChange={field.onChange}
                  disabled={submitProviderRequest.isPending}
                />
              </FormControl>
              <FormDescription>
                Selecione os tipos de serviços que você pode realizar e seu
                nível de experiência em cada um
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição dos Serviços *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os serviços que você pretende oferecer..."
                  {...field}
                  disabled={submitProviderRequest.isPending}
                  rows={4}
                  maxLength={500}
                />
              </FormControl>
              <FormDescription>
                Informe os tipos de serviços que você pode realizar (mín. 20,
                máx. 500 caracteres)
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
              <FormLabel>Experiência Profissional *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte-nos sobre sua experiência profissional, anos de atuação, projetos realizados..."
                  {...field}
                  disabled={submitProviderRequest.isPending}
                  rows={5}
                  maxLength={1000}
                />
              </FormControl>
              <FormDescription>
                Descreva sua experiência na área de atuação (mín. 50, máx. 1000
                caracteres)
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
              <FormLabel>Telefone *</FormLabel>
              <FormControl>
                <Input
                  placeholder="(11) 99999-9999"
                  {...field}
                  disabled={submitProviderRequest.isPending}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    field.onChange(formatted);
                  }}
                  maxLength={15}
                />
              </FormControl>
              <FormDescription>Digite seu telefone com DDD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="00000-000"
                    {...field}
                    disabled={submitProviderRequest.isPending || isLoadingCEP}
                    onChange={(e) => {
                      handleCEPChange(e.target.value);
                    }}
                    maxLength={9}
                  />
                  {isLoadingCEP && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Digite seu CEP para preenchimento automático do endereço
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Rua, número, bairro, cidade - UF"
                  {...field}
                  disabled={submitProviderRequest.isPending}
                  maxLength={200}
                />
              </FormControl>
              <FormDescription>
                Preenchido automaticamente pelo CEP. Você pode editar se
                necessário (máx. 200 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF ou CNPJ *</FormLabel>
              <FormControl>
                <div className="space-y-1">
                  <Input
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    {...field}
                    disabled={submitProviderRequest.isPending}
                    onChange={(e) => {
                      handleDocumentChange(e.target.value);
                    }}
                    maxLength={18}
                    className={
                      documentError ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
                  {documentError && (
                    <p className="text-sm text-red-500">{documentError}</p>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Digite seu CPF (11 dígitos) ou CNPJ (14 dígitos)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolioLinks"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PortfolioLinks
                  links={field.value || []}
                  onChange={field.onChange}
                  disabled={submitProviderRequest.isPending}
                />
              </FormControl>
              <FormDescription>
                Adicione links para seus trabalhos e projetos (máx. 5 links)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={submitProviderRequest.isPending}
        >
          {submitProviderRequest.isPending ? (
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
