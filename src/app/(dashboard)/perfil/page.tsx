"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { PersonalInfoForm } from "./_components/personal-info-form";
import { useProfile } from "@/hooks/use-profile";
import { useUserRole } from "@/hooks/use-user-role";
import { useProviderProfile } from "@/lib/queries/provider-profile";
import { ProviderProfileSection } from "./_components/provider-profile-section";
import { ProviderCategoriesSection } from "./_components/provider-categories-section";
import { ProviderAddressSection } from "./_components/provider-address-section";
import { ProviderPhoneSection } from "./_components/provider-phone-section";
import { ProviderValidationStatus } from "@/app/(dashboard)/(admin)/admin/gerenciar-usuarios/_components/provider-validation-status";
import type { ProviderDetails as AdminProviderDetails } from "@/lib/queries/admin-providers";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>("basic");

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { isProvider } = useUserRole();
  const {
    data: providerDetails,
    isLoading: isLoadingProviderDetails,
    refetch: refetchProviderDetails,
  } = useProviderProfile();

  useEffect(() => {
    if (tabParam === "provider" && isProvider) {
      setActiveTab("provider");
    } else {
      setActiveTab("basic");
    }
  }, [tabParam, isProvider]);

  const handleProviderUpdate = () => {
    refetchProviderDetails();
  };

  if (profileLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6">
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
          Gerencie suas informações pessoais
          {isProvider && " e do prestador"}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Informações Pessoais</TabsTrigger>
          {isProvider && (
            <TabsTrigger value="provider">Perfil de Prestador</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
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

        {isProvider && (
          <TabsContent value="provider" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perfil de Prestador</CardTitle>
                <CardDescription>
                  Gerencie suas informações como prestador de serviços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingProviderDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : providerDetails ? (
                  <>
                    <ProviderValidationStatus
                      providerDetails={providerDetails as AdminProviderDetails}
                    />
                    <Separator />
                    <ProviderProfileSection
                      profile={providerDetails.providerProfile}
                      onUpdate={handleProviderUpdate}
                    />
                    <Separator />
                    <ProviderCategoriesSection
                      categories={providerDetails.providerCategories}
                      onUpdate={handleProviderUpdate}
                    />
                    <Separator />
                    <ProviderAddressSection
                      address={providerDetails.activeAddress}
                      onUpdate={handleProviderUpdate}
                    />
                    <Separator />
                    <ProviderPhoneSection
                      phoneE164={providerDetails.phoneE164}
                      onUpdate={handleProviderUpdate}
                    />
                  </>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Erro ao carregar informações do prestador
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
