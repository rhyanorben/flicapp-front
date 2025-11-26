"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  // User,
  // Package,
  // MapPin,
  // Phone,
} from "lucide-react";
import { useProviderProfile } from "@/lib/queries/provider-profile";

export function ProviderStatusCard() {
  const router = useRouter();
  const { data: providerDetails, isLoading } = useProviderProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status do Perfil</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!providerDetails) {
    return null;
  }

  const hasProfile = !!providerDetails.providerProfile;
  // const hasCategories = providerDetails.providerCategories.length > 0;
  const hasActiveCategories =
    providerDetails.providerCategories.filter((c) => c.active).length > 0;
  const hasAddress = !!providerDetails.activeAddress;
  const hasPhone = !!providerDetails.phoneE164;

  const allValid = hasProfile && hasActiveCategories && hasAddress && hasPhone;

  const validationItems = [
    {
      label: "Perfil criado",
      valid: hasProfile,
      icon: hasProfile ? CheckCircle2 : XCircle,
      action: "Editar perfil",
    },
    {
      label: "Categorias ativas",
      valid: hasActiveCategories,
      icon: hasActiveCategories ? CheckCircle2 : XCircle,
      count: providerDetails.providerCategories.filter((c) => c.active).length,
      action: "Editar categorias",
    },
    {
      label: "Endereço ativo",
      valid: hasAddress,
      icon: hasAddress ? CheckCircle2 : XCircle,
      action: "Editar endereço",
    },
    {
      label: "Telefone cadastrado",
      valid: hasPhone,
      icon: hasPhone ? CheckCircle2 : XCircle,
      action: "Editar telefone",
    },
  ];

  const completedCount = validationItems.filter((item) => item.valid).length;
  const totalCount = validationItems.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  const missingItems = validationItems.filter((item) => !item.valid);

  return (
    <Card
      className={
        allValid
          ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
          : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
      }
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Status do Perfil
              {allValid ? (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Apto a Receber Serviços
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Perfil Incompleto
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">
              {allValid
                ? "Seu perfil está completo e você está apto a receber solicitações de serviços."
                : `Complete seu perfil para começar a receber solicitações. Faltam ${
                    missingItems.length
                  } item${missingItems.length > 1 ? "s" : ""}.`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completude do Perfil</span>
            <span className="font-medium">
              {completedCount}/{totalCount} completo
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <Separator />

        <div className="space-y-2">
          {validationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-md bg-background/50"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 ${
                      item.valid
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                  <span className="text-sm">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      ({item.count})
                    </span>
                  )}
                </div>
                {!item.valid && (
                  <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                )}
              </div>
            );
          })}
        </div>

        {!allValid && (
          <>
            <Separator />
            <Button
              onClick={() => router.push("/perfil?tab=provider")}
              className="w-full"
              variant={allValid ? "outline" : "default"}
            >
              Completar Perfil
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Clique para editar suas informações e completar seu perfil
            </p>
          </>
        )}

        {allValid && (
          <>
            <Separator />
            <Button
              onClick={() => router.push("/perfil?tab=provider")}
              variant="outline"
              className="w-full"
            >
              Gerenciar Perfil
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
