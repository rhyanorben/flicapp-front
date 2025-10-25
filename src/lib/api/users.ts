import { UserRole } from "@/app/generated/prisma";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  roles: UserRole[];
}

export interface UpdateUserRolesData {
  roles: UserRole[];
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/admin/users");

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
    method: "PATCH",
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
