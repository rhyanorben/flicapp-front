import { authClient } from "@/lib/auth-client";
import { UserRole, USER_ROLES, hasRole, isAdmin, isProvider, isClient, getRoleDisplayName } from "@/types/user";

export const useUserRole = () => {
  const { data: session, isPending } = authClient.useSession();
  
  // Por enquanto, vamos usar CLIENTE como padrão até o better-auth ser atualizado
  // TODO: Atualizar quando o better-auth suportar campos customizados
  const userRole: UserRole = USER_ROLES.CLIENTE;
  
  return {
    userRole,
    isAdmin: isAdmin(userRole),
    isProvider: isProvider(userRole),
    isClient: isClient(userRole),
    hasRole: (role: UserRole) => hasRole(userRole, role),
    roleDisplayName: getRoleDisplayName(userRole),
    isLoading: isPending,
    user: session?.user,
  };
};
