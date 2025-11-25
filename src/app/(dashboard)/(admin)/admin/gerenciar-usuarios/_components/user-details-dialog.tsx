"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserRole } from "@/app/generated/prisma";
import { Loader2 } from "lucide-react";
import { useUpdateUserRoles } from "@/lib/queries/users";
import { useProviderDetails } from "@/lib/queries/admin-providers";
import { ProviderProfileSection } from "./provider-profile-section";
import { ProviderCategoriesSection } from "./provider-categories-section";
import { ProviderAddressSection } from "./provider-address-section";
import { ProviderPhoneSection } from "./provider-phone-section";
import { ProviderValidationStatus } from "./provider-validation-status";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  roles: UserRole[];
}

interface UserDetailsDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function UserDetailsDialog({
  user,
  isOpen,
  onClose,
  onUpdate,
}: UserDetailsDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(user.roles);
  const isProvider = user.roles.includes("PRESTADOR");
  const updateUserRoles = useUpdateUserRoles();
  const {
    data: providerDetails,
    isLoading: isLoadingProviderDetails,
    refetch: refetchProviderDetails,
  } = useProviderDetails(isProvider && isOpen ? user.id : null);

  useEffect(() => {
    setSelectedRoles(user.roles);
  }, [user]);

  const handleRoleToggle = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    try {
      // Compare current roles with selected roles to determine what changes to make
      const currentRoles = user.roles;
      const rolesToAdd = selectedRoles.filter(
        (role) => !currentRoles.includes(role)
      );
      const rolesToRemove = currentRoles.filter(
        (role) => !selectedRoles.includes(role)
      );

      // Add new roles
      for (const role of rolesToAdd) {
        await updateUserRoles.mutateAsync({
          userId: user.id,
          data: { roleName: role, action: "assign" },
        });
      }

      // Remove roles
      for (const role of rolesToRemove) {
        await updateUserRoles.mutateAsync({
          userId: user.id,
          data: { roleName: role, action: "remove" },
        });
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar roles:", error);
    }
  };

  const handleProviderUpdate = () => {
    refetchProviderDetails();
    onUpdate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Visualize e gerencie as informações do usuário
            {isProvider && " e do prestador"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList
            className={isProvider ? "grid w-full grid-cols-2" : "w-full"}
          >
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            {isProvider && (
              <TabsTrigger value="provider">Perfil de Prestador</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Nome</Label>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Data de Cadastro</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Roles</Label>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="role-cliente"
                  checked={selectedRoles.includes("CLIENTE")}
                  onCheckedChange={() => handleRoleToggle("CLIENTE")}
                />
                <label
                  htmlFor="role-cliente"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Cliente
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="role-prestador"
                  checked={selectedRoles.includes("PRESTADOR")}
                  onCheckedChange={() => handleRoleToggle("PRESTADOR")}
                />
                <label
                  htmlFor="role-prestador"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Prestador
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="role-admin"
                  checked={selectedRoles.includes("ADMINISTRADOR")}
                  onCheckedChange={() => handleRoleToggle("ADMINISTRADOR")}
                />
                <label
                  htmlFor="role-admin"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Administrador
                </label>
              </div>
            </div>
          </TabsContent>

          {isProvider && (
            <TabsContent value="provider" className="space-y-6 py-4">
              {isLoadingProviderDetails ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : providerDetails ? (
                <>
                  <ProviderValidationStatus
                    providerDetails={providerDetails}
                  />

                  <Separator />

                  <ProviderProfileSection
                    providerId={user.id}
                    profile={providerDetails.providerProfile}
                    onUpdate={handleProviderUpdate}
                  />

                  <Separator />

                  <ProviderCategoriesSection
                    providerId={user.id}
                    categories={providerDetails.providerCategories}
                    onUpdate={handleProviderUpdate}
                  />

                  <Separator />

                  <ProviderAddressSection
                    providerId={user.id}
                    address={providerDetails.activeAddress}
                    onUpdate={handleProviderUpdate}
                  />

                  <Separator />

                  <ProviderPhoneSection
                    providerId={user.id}
                    phoneE164={providerDetails.phoneE164}
                    onUpdate={handleProviderUpdate}
                  />
                </>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Erro ao carregar informações do prestador
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateUserRoles.isPending}
          >
            Fechar
          </Button>
          <Button onClick={handleSave} disabled={updateUserRoles.isPending}>
            {updateUserRoles.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações de Roles"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
