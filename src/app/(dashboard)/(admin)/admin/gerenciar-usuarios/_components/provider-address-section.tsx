"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Edit2, Save, X, MapPin } from "lucide-react";
import { useUpdateProvider } from "@/lib/queries/admin-providers";
import type { ProviderDetails } from "@/lib/queries/admin-providers";

interface ProviderAddressSectionProps {
  providerId: string;
  address: ProviderDetails["activeAddress"];
  onUpdate: () => void;
}

export function ProviderAddressSection({
  providerId,
  address,
  onUpdate,
}: ProviderAddressSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    label: address?.label || "",
    cep: address?.cep || "",
    street: address?.street || "",
    number: address?.number || "",
    complement: address?.complement || "",
    neighborhood: address?.neighborhood || "",
    city: address?.city || "",
    state: address?.state || "",
  });
  const updateProvider = useUpdateProvider();

  const handleSave = async () => {
    try {
      await updateProvider.mutateAsync({
        providerId,
        data: {
          address: formData,
        },
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      label: address?.label || "",
      cep: address?.cep || "",
      street: address?.street || "",
      number: address?.number || "",
      complement: address?.complement || "",
      neighborhood: address?.neighborhood || "",
      city: address?.city || "",
      state: address?.state || "",
    });
    setIsEditing(false);
  };

  if (!address) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Endereço</Label>
        <p className="text-sm text-muted-foreground">
          Nenhum endereço ativo cadastrado
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Endereço Ativo</Label>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={updateProvider.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateProvider.isPending}
            >
              {updateProvider.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="label">Rótulo</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Ex: Casa, Trabalho..."
                disabled={updateProvider.isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) =>
                    setFormData({ ...formData, cep: e.target.value })
                  }
                  placeholder="00000-000"
                  disabled={updateProvider.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="SP"
                  maxLength={2}
                  disabled={updateProvider.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                placeholder="Nome da rua"
                disabled={updateProvider.isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  placeholder="123"
                  disabled={updateProvider.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) =>
                    setFormData({ ...formData, complement: e.target.value })
                  }
                  placeholder="Apto 101"
                  disabled={updateProvider.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) =>
                  setFormData({ ...formData, neighborhood: e.target.value })
                }
                placeholder="Nome do bairro"
                disabled={updateProvider.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Nome da cidade"
                disabled={updateProvider.isPending}
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                {address.label && (
                  <p className="text-sm font-medium">{address.label}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {[
                    address.street,
                    address.number && `nº ${address.number}`,
                    address.complement,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {[
                    address.neighborhood,
                    address.city,
                    address.state,
                  ].filter(Boolean).join(" - ")}
                </p>
                {address.cep && (
                  <p className="text-xs text-muted-foreground">
                    CEP: {address.cep}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

