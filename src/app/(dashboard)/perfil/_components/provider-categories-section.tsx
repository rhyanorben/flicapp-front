"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Edit2, Save, X, Package } from "lucide-react";
import { useUpdateProviderProfile } from "@/lib/queries/provider-profile";
import type { ProviderDetails } from "@/lib/queries/provider-profile";

interface ProviderCategoriesSectionProps {
  categories: ProviderDetails["providerCategories"];
  onUpdate: () => void;
}

export function ProviderCategoriesSection({
  categories,
  onUpdate,
}: ProviderCategoriesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategories, setEditedCategories] = useState(
    categories.map((cat) => ({
      id: cat.id,
      minPriceCents: cat.minPriceCents,
      active: cat.active,
      isAvailable: cat.isAvailable ?? true,
    }))
  );
  const updateProvider = useUpdateProviderProfile();

  const handleCategoryChange = (
    categoryId: string,
    field: "minPriceCents" | "active" | "isAvailable",
    value: number | boolean
  ) => {
    setEditedCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      )
    );
  };

  const handleSave = async () => {
    try {
      await updateProvider.mutateAsync({
        categories: editedCategories,
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating categories:", error);
    }
  };

  const handleCancel = () => {
    setEditedCategories(
      categories.map((cat) => ({
        id: cat.id,
        minPriceCents: cat.minPriceCents,
        active: cat.active,
        isAvailable: cat.isAvailable ?? true,
      }))
    );
    setIsEditing(false);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  if (categories.length === 0) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Categorias</Label>
        <p className="text-sm text-muted-foreground">
          Nenhuma categoria cadastrada
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">
          Categorias ({categories.length})
        </Label>
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

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {categories.map((category) => {
          const edited = editedCategories.find((c) => c.id === category.id);
          if (!edited) return null;

          return (
            <div
              key={category.id}
              className="p-3 border rounded-lg space-y-3 bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">
                    {category.categoryName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={
                      edited.active
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
                        : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800"
                    }
                  >
                    {edited.active ? "Ativa" : "Inativa"}
                  </Badge>
                  {edited.isAvailable && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
                    >
                      Disponível
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Preço Mínimo</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={edited.minPriceCents}
                      onChange={(e) =>
                        handleCategoryChange(
                          category.id,
                          "minPriceCents",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={updateProvider.isPending}
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {formatPrice(edited.minPriceCents)}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id={`active-${category.id}`}
                    checked={edited.active}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(
                        category.id,
                        "active",
                        checked === true
                      )
                    }
                    disabled={!isEditing || updateProvider.isPending}
                  />
                  <label
                    htmlFor={`active-${category.id}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Ativa
                  </label>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id={`available-${category.id}`}
                    checked={edited.isAvailable}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(
                        category.id,
                        "isAvailable",
                        checked === true
                      )
                    }
                    disabled={!isEditing || updateProvider.isPending}
                  />
                  <label
                    htmlFor={`available-${category.id}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Disponível
                  </label>
                </div>
              </div>

              {category.score !== null && (
                <div className="text-xs text-muted-foreground">
                  Score: {category.score.toFixed(2)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

