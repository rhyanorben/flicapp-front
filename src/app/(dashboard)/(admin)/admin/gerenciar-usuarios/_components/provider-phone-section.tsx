"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Edit2, Save, X, Phone } from "lucide-react";
import { useUpdateProvider } from "@/lib/queries/admin-providers";
import { formatPhoneFromE164, formatPhoneNumber } from "@/lib/utils/phone-mask";

interface ProviderPhoneSectionProps {
  providerId: string;
  phoneE164: string | null;
  onUpdate: () => void;
}

export function ProviderPhoneSection({
  providerId,
  phoneE164,
  onUpdate,
}: ProviderPhoneSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(
    phoneE164 ? formatPhoneFromE164(phoneE164) : ""
  );
  const updateProvider = useUpdateProvider();

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
  };

  const handleSave = async () => {
    try {
      await updateProvider.mutateAsync({
        providerId,
        data: {
          phone,
        },
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating phone:", error);
    }
  };

  const handleCancel = () => {
    setPhone(phoneE164 ? formatPhoneFromE164(phoneE164) : "");
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Telefone</Label>
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

      <div className="space-y-2">
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(11) 99999-9999"
              maxLength={15}
              disabled={updateProvider.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Formato: (XX) XXXXX-XXXX
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {phoneE164 ? formatPhoneFromE164(phoneE164) : "Não cadastrado"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

