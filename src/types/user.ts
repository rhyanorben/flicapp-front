import { UserRole } from "@/app/generated/prisma";

export type { UserRole };

export const USER_ROLES = {
  ADMINISTRADOR: 'ADMINISTRADOR' as const,
  PRESTADOR: 'PRESTADOR' as const,
  CLIENTE: 'CLIENTE' as const,
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return userRole === requiredRole;
};

export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === USER_ROLES.ADMINISTRADOR;
};

export const isProvider = (userRole: UserRole): boolean => {
  return userRole === USER_ROLES.PRESTADOR;
};

export const isClient = (userRole: UserRole): boolean => {
  return userRole === USER_ROLES.CLIENTE;
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case USER_ROLES.ADMINISTRADOR:
      return 'Administrador';
    case USER_ROLES.PRESTADOR:
      return 'Prestador';
    case USER_ROLES.CLIENTE:
      return 'Cliente';
    default:
      return 'Cliente';
  }
};
