"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProfileMutations } from "@/hooks/use-profile";
import { formatCEP, validateCEP } from "@/lib/utils/viacep";
import { fetchAddressByCEP } from "@/lib/utils/viacep";
import type { AddressData } from "@/types/profile";

const addressFormSchema = z.object({
  label: z
    .string()
    .min(1, "Label é obrigatório")
    .max(50, "Label deve ter no máximo 50 caracteres"),
  cep: z
    .string()
    .min(1, "CEP é obrigatório")
    .refine((cep) => validateCEP(cep), {
      message: "Digite um CEP válido com 8 dígitos",
    }),
  street: z
    .string()
    .min(1, "Rua é obrigatória")
    .max(200, "Rua deve ter no máximo 200 caracteres"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .max(20, "Número deve ter no máximo 20 caracteres"),
  complement: z
    .string()
    .max(100, "Complemento deve ter no máximo 100 caracteres")
    .optional(),
  neighborhood: z
    .string()
    .min(1, "Bairro é obrigatório")
    .max(100, "Bairro deve ter no máximo 100 caracteres"),
  city: z
    .string()
    .min(1, "Cidade é obrigatória")
    .max(100, "Cidade deve ter no máximo 100 caracteres"),
  state: z
    .string()
    .min(2, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 caracteres"),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address?: AddressData | null;
}

const LABEL_OPTIONS = [
  { value: "Casa", label: "Casa" },
  { value: "Trabalho", label: "Trabalho" },
  { value: "Outro", label: "Outro" },
];

const STATE_OPTIONS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export function AddressFormDialog({
  isOpen,
  onClose,
  address,
}: AddressFormDialogProps) {
  const { toast } = useToast();
  const { createAddress, updateAddress } = useProfileMutations();
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      label: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  // Pre-fill form with address data when editing
  useEffect(() => {
    if (address) {
      form.reset({
        label: address.label || "",
        cep: address.cep || "",
        street: address.street || "",
        number: address.number || "",
        complement: address.complement || "",
        neighborhood: address.neighborhood || "",
        city: address.city || "",
        state: address.state || "",
      });
    } else {
      form.reset({
        label: "",
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });
    }
  }, [address, form]);

  const handleCEPChange = async (cep: string) => {
    const formattedCEP = formatCEP(cep);
    form.setValue("cep", formattedCEP);

    if (validateCEP(formattedCEP)) {
      setIsLoadingCEP(true);
      try {
        const addressData = await fetchAddressByCEP(formattedCEP);
        if (addressData) {
          form.setValue("street", addressData.street || "");
          form.setValue("neighborhood", addressData.neighborhood || "");
          form.setValue("city", addressData.city || "");
          form.setValue("state", addressData.state || "");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast({
          title: "Erro ao buscar CEP",
          description:
            "Não foi possível buscar os dados do endereço. Verifique o CEP e tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCEP(false);
      }
    }
  };

  const onSubmit = async (data: AddressFormValues) => {
    try {
      if (address) {
        // Update existing address
        await updateAddress.mutateAsync({
          addressId: address.id,
          data,
        });
        toast({
          title: "Endereço atualizado",
          description: "O endereço foi atualizado com sucesso.",
        });
      } else {
        // Create new address
        await createAddress.mutateAsync(data);
        toast({
          title: "Endereço adicionado",
          description: "O endereço foi adicionado com sucesso.",
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Erro ao salvar endereço",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const isLoading = createAddress.isPending || updateAddress.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {address ? "Editar Endereço" : "Adicionar Endereço"}
          </DialogTitle>
          <DialogDescription>
            {address
              ? "Atualize as informações do endereço"
              : "Adicione um novo endereço para facilitar futuras solicitações de serviço"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um label" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LABEL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="00000-000"
                        disabled={isLoading || isLoadingCEP}
                        onChange={(e) => {
                          handleCEPChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nome da rua"
                      disabled={isLoading || isLoadingCEP}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Apto 101"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Centro"
                        disabled={isLoading || isLoadingCEP}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="São Paulo"
                        disabled={isLoading || isLoadingCEP}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || isLoadingCEP}>
                {isLoading
                  ? address
                    ? "Atualizando..."
                    : "Adicionando..."
                  : address
                  ? "Atualizar Endereço"
                  : "Adicionar Endereço"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
