"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Edit2, Save, X } from "lucide-react";
import { useUpdateProviderProfile } from "@/lib/queries/provider-profile";
import type { ProviderDetails } from "@/lib/queries/provider-profile";

interface ProviderProfileSectionProps {
  profile: ProviderDetails["providerProfile"];
  onUpdate: () => void;
}

export function ProviderProfileSection({
  profile,
  onUpdate,
}: ProviderProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "");
  const [radiusKm, setRadiusKm] = useState(
    profile?.radiusKm.toString() || "10"
  );
  const updateProvider = useUpdateProviderProfile();

  const handleSave = async () => {
    try {
      await updateProvider.mutateAsync({
        profile: {
          bio: bio || undefined,
          radiusKm: parseFloat(radiusKm),
        },
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setBio(profile?.bio || "");
    setRadiusKm(profile?.radiusKm.toString() || "10");
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Perfil do Prestador</Label>
        <p className="text-sm text-muted-foreground">
          Nenhum perfil encontrado. O perfil será criado automaticamente ao
          salvar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Perfil do Prestador</Label>
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Biografia</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Descreva seus serviços e experiência..."
              rows={4}
              maxLength={1000}
              disabled={updateProvider.isPending}
            />
          ) : (
            <p className="text-sm text-muted-foreground min-h-[60px]">
              {profile.bio || "Nenhuma biografia cadastrada"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="radiusKm">Raio de Atuação (km)</Label>
          {isEditing ? (
            <Input
              id="radiusKm"
              type="number"
              min="1"
              max="100"
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              disabled={updateProvider.isPending}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {profile.radiusKm} km
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Avaliação Média
            </Label>
            <p className="text-sm font-medium">
              {profile.avgRating.toFixed(1)} ⭐
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Total de Avaliações
            </Label>
            <p className="text-sm font-medium">{profile.totalReviews}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Taxa de Aceitação (30d)
            </Label>
            <p className="text-sm font-medium">
              {(profile.acceptRate30d * 100).toFixed(1)}%
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              No-Show (30d)
            </Label>
            <p className="text-sm font-medium">{profile.noShow30d}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

