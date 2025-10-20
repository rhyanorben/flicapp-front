"use client";

import { authClient } from "@/lib/auth-client";
import { UserRole, USER_ROLES, hasRole, isAdmin, isProvider, isClient, getRoleDisplayName } from "@/types/user";
import { useState, useEffect } from "react";

export const useUserRole = () => {
  const { data: session, isPending } = authClient.useSession();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  
  // Para compatibilidade com o código existente, vamos usar a primeira role como "role principal"
  const primaryRole: UserRole = userRoles.length > 0 ? userRoles[0] : USER_ROLES.CLIENTE;
  
  useEffect(() => {
    const fetchUserRoles = async () => {
      if (session?.user?.id) {
        setIsLoadingRoles(true);
        try {
          const response = await fetch(`/api/user/${session.user.id}/roles`);
          if (response.ok) {
            const roles = await response.json();
            setUserRoles(roles);
          }
        } catch (error) {
          console.error("Erro ao buscar roles do usuário:", error);
        } finally {
          setIsLoadingRoles(false);
        }
      }
    };

    fetchUserRoles();
  }, [session?.user?.id]);
  
  return {
    userRole: primaryRole, // Mantém compatibilidade
    userRoles, // Nova propriedade com todas as roles
    isAdmin: isAdmin(primaryRole) || userRoles.includes(USER_ROLES.ADMINISTRADOR),
    isProvider: isProvider(primaryRole) || userRoles.includes(USER_ROLES.PRESTADOR),
    isClient: isClient(primaryRole) || userRoles.includes(USER_ROLES.CLIENTE),
    hasRole: (role: UserRole) => hasRole(primaryRole, role) || userRoles.includes(role),
    hasAnyRole: (roles: UserRole[]) => roles.some(role => userRoles.includes(role)),
    roleDisplayName: getRoleDisplayName(primaryRole),
    rolesDisplayNames: userRoles.map(role => getRoleDisplayName(role)),
    isLoading: isPending || isLoadingRoles,
    user: session?.user,
    session,
  };
};
