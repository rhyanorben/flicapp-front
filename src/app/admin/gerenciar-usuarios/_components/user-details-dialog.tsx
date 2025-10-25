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
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/app/generated/prisma";
import { Loader2 } from "lucide-react";

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
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedRoles(user.roles);
  }, [user]);

  const handleRoleToggle = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = async () => {
    setIsUpdating(true);

    try {
      const rolesToAdd = selectedRoles.filter((r) => !user.roles.includes(r));
      const rolesToRemove = user.roles.filter((r) => !selectedRoles.includes(r));

      for (const role of rolesToAdd) {
        const response = await fetch(`/api/user/${user.id}/roles/manage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roleName: role,
            action: "assign",
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao adicionar role ${role}`);
        }
      }

      for (const role of rolesToRemove) {
        const response = await fetch(`/api/user/${user.id}/roles/manage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roleName: role,
            action: "remove",
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao remover role ${role}`);
        }
      }

      toast({
        title: "Sucesso",
        description: "Roles do usuário atualizadas com sucesso",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating user roles:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar roles do usuário",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Visualize e gerencie as roles do usuário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

          <div className="space-y-3 pt-4 border-t">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

