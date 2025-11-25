import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma";

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

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

export async function assignRoleToUser(userId: string, roleName: UserRole) {
  // Verify userId is a valid UUID format
  if (!userId || typeof userId !== "string") {
    throw new Error(`UserId inválido: ${userId}`);
  }

  if (!isValidUUID(userId)) {
    console.error(`UserId não é um UUID válido: ${userId}`);
    throw new Error(`UserId deve ser um UUID válido, recebido: ${userId}`);
  }

  // Ensure role exists, create if it doesn't
  const role = await prisma.role.upsert({
    where: { name: roleName },
    update: {},
    create: {
      name: roleName,
    },
  });

  // Verify roleId is valid (role.id is a CUID, not UUID, which is fine for roleId field)
  if (!role.id || typeof role.id !== "string") {
    throw new Error(`RoleId inválido: ${role.id}`);
  }

  console.log(`Assigning role ${roleName} (id: ${role.id}) to user ${userId}`);

  // Check if assignment already exists
  const existing = await prisma.userRoleAssignment.findUnique({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
  });

  if (existing) {
    console.log(`Role assignment already exists for user ${userId} and role ${roleName}`);
    return existing;
  }

  // Create new assignment
  // Note: userRoleAssignment.id is auto-generated as UUID by the database
  // We only provide userId (UUID) and roleId (CUID)
  try {
    const assignment = await prisma.userRoleAssignment.create({
      data: {
        userId,
        roleId: role.id,
      },
    });
    console.log(`Successfully created role assignment: ${assignment.id}`);
    return assignment;
  } catch (error) {
    console.error("Error creating userRoleAssignment:", error);
    console.error("userId:", userId, "isValidUUID:", isValidUUID(userId));
    console.error("roleId:", role.id);
    throw error;
  }
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

export async function userHasRole(
  userId: string,
  roleName: UserRole
): Promise<boolean> {
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

export async function userHasAnyRole(
  userId: string,
  roleNames: UserRole[]
): Promise<boolean> {
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
