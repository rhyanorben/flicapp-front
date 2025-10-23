"use client";

import { useRolesContext } from "@/contexts/roles-context";

/**
 * Hook para acessar roles do usuário
 * Agora usa RolesContext que persiste roles durante navegação
 */
export const useUserRole = () => {
  return useRolesContext();
};
