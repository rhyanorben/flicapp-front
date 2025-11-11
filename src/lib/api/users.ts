import { UserRole } from "@/app/generated/prisma";

export interface ProviderSummary {
  hasProfile: boolean;
  avgRating: number;
  totalReviews: number;
  categoriesCount: number;
  activeCategoriesCount: number;
  hasActiveAddress: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phoneE164?: string | null;
  createdAt: string;
  roles: UserRole[];
  providerSummary?: ProviderSummary | null;
}

export interface UpdateUserRolesData {
  roleName: UserRole;
  action: "assign" | "remove";
}

export async function getUsers(roleFilter?: string): Promise<User[]> {
  const url = new URL("/api/admin/users", window.location.origin);
  if (roleFilter && roleFilter !== "todos") {
    url.searchParams.set("role", roleFilter);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Acesso negado");
    }
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar usuários");
  }

  return response.json();
}

export async function updateUserRoles(
  userId: string,
  data: UpdateUserRolesData
): Promise<{ message: string }> {
  const response = await fetch(`/api/user/${userId}/roles/manage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar roles do usuário");
  }

  return response.json();
}
