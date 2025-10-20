"use client";

import { authClient } from "@/lib/auth-client";
import { UserRole, USER_ROLES, getRoleDisplayName } from "@/types/user";
import { useState, useEffect } from "react";

export const useUserRole = () => {
  const { data: session, isPending } = authClient.useSession();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  
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
    userRoles,
    isAdmin: userRoles.includes(USER_ROLES.ADMINISTRADOR),
    isProvider: userRoles.includes(USER_ROLES.PRESTADOR),
    isClient: userRoles.includes(USER_ROLES.CLIENTE),
    hasRole: (role: UserRole) => userRoles.includes(role),
    hasAnyRole: (roles: UserRole[]) => roles.some(role => userRoles.includes(role)),
    rolesDisplayNames: userRoles.map(role => getRoleDisplayName(role)),
    isLoading: isPending || isLoadingRoles,
    user: session?.user,
    session,
  };
};
