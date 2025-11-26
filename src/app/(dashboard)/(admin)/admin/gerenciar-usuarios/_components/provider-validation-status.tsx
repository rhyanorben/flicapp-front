"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ProviderDetails } from "@/lib/queries/admin-providers";

interface ProviderValidationStatusProps {
  providerDetails: ProviderDetails;
}

export function ProviderValidationStatus({
  providerDetails,
}: ProviderValidationStatusProps) {
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
    },
    {
      label: "Categorias ativas",
      valid: hasActiveCategories,
      icon: hasActiveCategories ? CheckCircle2 : XCircle,
      count: providerDetails.providerCategories.filter((c) => c.active).length,
    },
    {
      label: "Endereço ativo",
      valid: hasAddress,
      icon: hasAddress ? CheckCircle2 : XCircle,
    },
    {
      label: "Telefone cadastrado",
      valid: hasPhone,
      icon: hasPhone ? CheckCircle2 : XCircle,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Status de Validação</span>
        <Badge
          variant="outline"
          className={
            allValid
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800"
          }
        >
          {allValid ? "Completo" : "Incompleto"}
        </Badge>
      </div>

      <div className="space-y-2">
        {validationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md bg-muted/30"
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
    </div>
  );
}
