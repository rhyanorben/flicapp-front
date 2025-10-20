import { PrismaClient, UserRole } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function initializeRoles() {
  const roles = [
    { name: UserRole.ADMINISTRADOR },
    { name: UserRole.PRESTADOR },
    { name: UserRole.CLIENTE },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
}

export async function assignRoleToUser(userId: string, roleName: UserRole) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role ${roleName} não encontrada`);
  }

  return await prisma.userRoleAssignment.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: role.id,
    },
  });
}

export async function removeRoleFromUser(userId: string, roleName: UserRole) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role ${roleName} não encontrada`);
  }

  return await prisma.userRoleAssignment.deleteMany({
    where: {
      userId,
      roleId: role.id,
    },
  });
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const userRoles = await prisma.userRoleAssignment.findMany({
    where: { userId },
    include: { role: true },
  });

  return userRoles.map((userRole) => userRole.role.name);
}

export async function userHasRole(userId: string, roleName: UserRole): Promise<boolean> {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    return false;
  }

  const userRole = await prisma.userRoleAssignment.findUnique({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
  });

  return !!userRole;
}

export async function userHasAnyRole(userId: string, roleNames: UserRole[]): Promise<boolean> {
  const userRoles = await getUserRoles(userId);
  return roleNames.some((roleName) => userRoles.includes(roleName));
}

export async function getUserWithRoles(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });
}
