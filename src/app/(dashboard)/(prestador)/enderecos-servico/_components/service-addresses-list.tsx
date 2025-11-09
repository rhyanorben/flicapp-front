"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";
import { AddressFormDialog } from "@/app/(dashboard)/perfil/_components/address-form-dialog";
import { useAddresses, useProfileMutations } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import type { AddressData } from "@/types/profile";

export function ServiceAddressesList() {
  const { toast } = useToast();
  const { data: addresses, isLoading } = useAddresses();
  const { toggleAddressActive, deleteAddress } = useProfileMutations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(
    null
  );

  const handleToggleActive = async (address: AddressData) => {
    try {
      await toggleAddressActive.mutateAsync(address.id);
      toast({
        title: address.active ? "Endereço desativado" : "Endereço ativado",
        description: address.active
          ? "Este endereço não será mais usado para prestação de serviços."
          : "Este endereço agora será usado para prestação de serviços.",
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: AddressData) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Tem certeza que deseja remover este endereço?")) {
      return;
    }

    try {
      await deleteAddress.mutateAsync(addressId);
      toast({
        title: "Endereço removido",
        description: "O endereço foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover endereço",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: AddressData) => {
    const parts = [
      address.street,
      address.number,
      address.complement,
      address.neighborhood,
      address.city,
      address.state,
    ].filter(Boolean);

    return parts.join(", ");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeCount = addresses?.filter((addr) => addr.active).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Endereços de Serviço</h3>
          <p className="text-sm text-muted-foreground">
            {addresses?.length || 0} endereço(s) cadastrado(s) • {activeCount}{" "}
            ativo(s)
          </p>
        </div>
        <Button onClick={handleAddAddress} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Endereço
        </Button>
      </div>

      {!addresses || addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum endereço cadastrado
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Adicione endereços onde você deseja prestar serviços.
            </p>
            <Button onClick={handleAddAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Endereço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={address.active}
                      onCheckedChange={() => handleToggleActive(address)}
                      disabled={toggleAddressActive.isPending}
                      className="mt-1"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {address.label || "Endereço"}
                        </CardTitle>
                        <Badge
                          variant={address.active ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {address.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {formatAddress(address)}
                      </CardDescription>
                      {address.cep && (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            CEP: {address.cep}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      className="shrink-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      disabled={deleteAddress.isPending}
                      className="text-destructive hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <AddressFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
      />
    </div>
  );
}
