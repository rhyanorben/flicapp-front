"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonalInfoForm } from "./_components/personal-info-form";
import { AddressesList } from "./_components/addresses-list";
import { useProfile, useAddresses } from "@/hooks/use-profile";

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();

  if (profileLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e endereços
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="addresses">Endereços</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações de contato e dados pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Endereços</CardTitle>
              <CardDescription>
                Gerencie seus endereços de entrega e atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddressesList
                addresses={addresses}
                isLoading={addressesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
