"use client";

import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types/user";
import { useRoleDashboard } from "@/lib/queries/dashboard";
import { RoleSelector } from "./_components/role-selector";
import { AdminDashboard } from "./_components/admin-dashboard";
import { ClientDashboard } from "./_components/client-dashboard";
import { ProviderDashboard } from "./_components/provider-dashboard";

// Tipo para aceitar todos os tipos de dados dos dashboards
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DashboardData = any;

const ROLE_DASHBOARD_TITLES = {
  CLIENTE: "Meu Dashboard",
  PRESTADOR: "Dashboard do Prestador",
  ADMINISTRADOR: "Dashboard Administrativo",
};

const ROLE_DASHBOARD_DESCRIPTIONS = {
  CLIENTE: "Gerencie seus serviços e acompanhe seus pedidos",
  PRESTADOR: "Monitore suas solicitações e gerencie sua agenda",
  ADMINISTRADOR: "Visão geral completa do sistema FlicApp",
};

export default function Page() {
  const { userRoles, isLoading: isLoadingRoles } = useUserRole();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Determinar role padrão ou selecionada
  useEffect(() => {
    if (userRoles.length > 0 && !selectedRole) {
      // Prioridade: ADMINISTRADOR > PRESTADOR > CLIENTE
      if (userRoles.includes("ADMINISTRADOR")) {
        setSelectedRole("ADMINISTRADOR");
      } else if (userRoles.includes("PRESTADOR")) {
        setSelectedRole("PRESTADOR");
      } else {
        setSelectedRole("CLIENTE");
      }
    }
  }, [userRoles, selectedRole]);

  // Buscar dados baseado na role selecionada
  const { data, isLoading, error } = useRoleDashboard(
    selectedRole || "CLIENTE"
  );

  // Loading state geral
  if (isLoadingRoles) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        <div className="h-96 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  // Se não tem roles, mostrar erro
  if (userRoles.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Nenhuma role encontrada para este usuário
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">
            Entre em contato com o administrador para configurar suas permissões
          </p>
        </div>
      </div>
    );
  }

  const hasMultipleRoles = userRoles.length > 1;
  const currentTitle = selectedRole
    ? ROLE_DASHBOARD_TITLES[selectedRole]
    : "Dashboard";
  const currentDescription = selectedRole
    ? ROLE_DASHBOARD_DESCRIPTIONS[selectedRole]
    : "Seu dashboard personalizado";

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{currentTitle}</h1>
        <p className="text-sm text-muted-foreground">{currentDescription}</p>
      </div>

      {/* Role Selector (apenas se múltiplas roles) */}
      {hasMultipleRoles && selectedRole && (
        <RoleSelector
          userRoles={userRoles}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
      )}

      {/* Dashboard específico baseado na role */}
      {selectedRole === "ADMINISTRADOR" && (
        <AdminDashboard data={data as DashboardData} isLoading={isLoading} />
      )}

      {selectedRole === "PRESTADOR" && (
        <ProviderDashboard data={data as DashboardData} isLoading={isLoading} />
      )}

      {selectedRole === "CLIENTE" && (
        <ClientDashboard data={data as DashboardData} isLoading={isLoading} />
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Erro ao carregar dados do dashboard
            </p>
            <p className="text-sm text-muted-foreground">
              Tente recarregar a página
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
