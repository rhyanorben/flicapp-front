"use client";

import { authClient } from "@/lib/auth-client";
import { UserRole, USER_ROLES, hasRole, isAdmin, isProvider, isClient, getRoleDisplayName } from "@/types/user";

export const useUserRole = () => {
  const { data: session, isPending } = authClient.useSession();
  
  const userRole: UserRole = (session?.user?.role as UserRole) || USER_ROLES.CLIENTE;
  
  return {
    userRole,
    isAdmin: isAdmin(userRole),
    isProvider: isProvider(userRole),
    isClient: isClient(userRole),
    hasRole: (role: UserRole) => hasRole(userRole, role),
    roleDisplayName: getRoleDisplayName(userRole),
    isLoading: isPending,
    user: session?.user,
    session,
  };
};
