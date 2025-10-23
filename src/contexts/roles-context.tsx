"use client";

import { authClient } from "@/lib/auth-client";
import { UserRole, USER_ROLES, getRoleDisplayName } from "@/types/user";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RolesContextType {
  userRoles: UserRole[];
  isAdmin: boolean;
  isProvider: boolean;
  isClient: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  rolesDisplayNames: string[];
  isLoading: boolean;
  user: any;
  session: any;
  refreshRoles: () => Promise<void>;
}

const RolesContext = createContext<RolesContextType | undefined>(undefined);

const ROLES_STORAGE_KEY = "flicapp_user_roles";
const ROLES_TIMESTAMP_KEY = "flicapp_user_roles_timestamp";
const CACHE_DURATION = 5 * 60 * 1000;

export function RolesProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [userRoles, setUserRoles] = useState<UserRole[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(ROLES_STORAGE_KEY);
        const timestamp = localStorage.getItem(ROLES_TIMESTAMP_KEY);
        
        if (stored && timestamp) {
          const age = Date.now() - parseInt(timestamp);
          if (age < CACHE_DURATION) {
            return JSON.parse(stored);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar roles do localStorage:", error);
      }
    }
    return [];
  });
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const fetchUserRoles = async () => {
    if (!session?.user?.id) {
      setUserRoles([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem(ROLES_STORAGE_KEY);
        localStorage.removeItem(ROLES_TIMESTAMP_KEY);
      }
      return;
    }

    setIsLoadingRoles(true);
    try {
      const response = await fetch(`/api/user/${session.user.id}/roles`);
      if (response.ok) {
        const roles = await response.json();
        setUserRoles(roles);
        
        if (typeof window !== "undefined") {
          localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
          localStorage.setItem(ROLES_TIMESTAMP_KEY, Date.now().toString());
        }
      }
    } catch (error) {
      console.error("Erro ao buscar roles do usuário:", error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, [session?.user?.id]);

  const value: RolesContextType = {
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
    refreshRoles: fetchUserRoles,
  };

  return (
    <RolesContext.Provider value={value}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRolesContext() {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error("useRolesContext must be used within a RolesProvider");
  }
  return context;
}

