"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useProfileMutations } from "@/hooks/use-profile";
import {
  formatPhoneFromE164,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/lib/utils/phone-mask";
import {
  formatDocument,
  validateDocument,
} from "@/lib/utils/document-validation";
import type { ProfileData } from "@/types/profile";

const personalInfoSchema = z.object({
  name: z
    .string()
    .min(5, "O nome deve ter pelo menos 5 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine((phone) => validatePhoneNumber(phone), {
      message: "Digite um telefone válido com 11 dígitos",
    }),
  cpf: z
    .string()
    .optional()
    .refine((cpf) => !cpf || validateDocument(cpf), {
      message: "Digite um CPF válido",
    }),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  profile: ProfileData | undefined;
}

export function PersonalInfoForm({ profile }: PersonalInfoFormProps) {
  const { toast } = useToast();
  const { updateProfile } = useProfileMutations();
  const [isEditing, setIsEditing] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      phone: "",
      cpf: "",
    },
  });

  // Pre-fill form with profile data
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        phone: formatPhoneFromE164(profile.phoneE164),
        cpf: profile.cpf || "",
      });
    }
  }, [profile, form]);

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value);
    form.setValue("cpf", formatted);

    // Clear previous error
    setDocumentError(null);

    // Validate if document is complete
    const numbers = formatted.replace(/\D/g, "");
    if (numbers.length === 11) {
      if (!validateDocument(formatted)) {
        setDocumentError("CPF inválido");
      }
    }
  };

  const handlePhoneChange = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    form.setValue("phone", formatted);
  };

  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      await updateProfile.mutateAsync({
        name: data.name,
        phone: data.phone,
        cpf: data.cpf,
      });

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        phone: formatPhoneFromE164(profile.phoneE164),
        cpf: profile.cpf || "",
      });
    }
    setIsEditing(false);
    setDocumentError(null);
  };

  if (!profile) {
    return <div>Carregando...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={!isEditing || updateProfile.isPending}
                    placeholder="Seu nome completo"
                  />
                </FormControl>
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
                    {...field}
                    disabled={!isEditing || updateProfile.isPending}
                    placeholder="(11) 99999-9999"
                    onChange={(e) => {
                      handlePhoneChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              O email não pode ser alterado
            </p>
          </div>

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={
                      !isEditing ||
                      updateProfile.isPending ||
                      (!!profile.cpf && isEditing)
                    }
                    placeholder="000.000.000-00"
                    onChange={(e) => {
                      handleDocumentChange(e.target.value);
                    }}
                    className={profile.cpf && isEditing ? "bg-muted" : ""}
                  />
                </FormControl>
                {documentError && (
                  <p className="text-sm text-destructive">{documentError}</p>
                )}
                {profile.cpf && isEditing && (
                  <p className="text-sm text-muted-foreground">
                    O CPF não pode ser alterado após o cadastro
                  </p>
                )}
                {!profile.cpf && (
                  <p className="text-sm text-muted-foreground">
                    Adicione seu CPF para completar o cadastro
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {!isEditing ? (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={updateProfile.isPending}
            >
              Editar Informações
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateProfile.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
