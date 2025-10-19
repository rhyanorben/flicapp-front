import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@flicapp.com" },
      update: {},
      create: {
        id: "admin-001",
        name: "Administrador",
        email: "admin@flicapp.com",
        emailVerified: true,
        role: "ADMINISTRADOR",
      },
    });

    const providerUser = await prisma.user.upsert({
      where: { email: "prestador@flicapp.com" },
      update: {},
      create: {
        id: "provider-001",
        name: "João Prestador",
        email: "prestador@flicapp.com",
        emailVerified: true,
        role: "PRESTADOR",
      },
    });

    const clientUser = await prisma.user.upsert({
      where: { email: "cliente@flicapp.com" },
      update: {},
      create: {
        id: "client-001",
        name: "Maria Cliente",
        email: "cliente@flicapp.com",
        emailVerified: true,
        role: "CLIENTE",
      },
    });

    console.log("Usuários de teste criados:");
    console.log("- Administrador:", adminUser.email, "Role:", adminUser.role);
    console.log("- Prestador:", providerUser.email, "Role:", providerUser.role);
    console.log("- Cliente:", clientUser.email, "Role:", clientUser.role);

    await prisma.account.upsert({
      where: { id: "admin-account-001" },
      update: {},
      create: {
        id: "admin-account-001",
        accountId: "admin-001",
        providerId: "credential",
        userId: adminUser.id,
        password: "admin123",
      },
    });

    await prisma.account.upsert({
      where: { id: "provider-account-001" },
      update: {},
      create: {
        id: "provider-account-001",
        accountId: "provider-001",
        providerId: "credential",
        userId: providerUser.id,
        password: "prestador123",
      },
    });

    await prisma.account.upsert({
      where: { id: "client-account-001" },
      update: {},
      create: {
        id: "client-account-001",
        accountId: "client-001",
        providerId: "credential",
        userId: clientUser.id,
        password: "cliente123",
      },
    });

    console.log("\nContas de login criadas:");
    console.log("- admin@flicapp.com / admin123");
    console.log("- prestador@flicapp.com / prestador123");
    console.log("- cliente@flicapp.com / cliente123");

  } catch (error) {
    console.error("Erro ao criar usuários de teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
