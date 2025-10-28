import { PrismaClient, UserRole } from "../src/app/generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // 1. Criar Roles
  console.log("📋 Criando roles...");
  const adminRole = await prisma.role.upsert({
    where: { name: UserRole.ADMINISTRADOR },
    update: {},
    create: {
      name: UserRole.ADMINISTRADOR,
    },
  });

  const providerRole = await prisma.role.upsert({
    where: { name: UserRole.PRESTADOR },
    update: {},
    create: {
      name: UserRole.PRESTADOR,
    },
  });

  const clientRole = await prisma.role.upsert({
    where: { name: UserRole.CLIENTE },
    update: {},
    create: {
      name: UserRole.CLIENTE,
    },
  });

  console.log("✅ Roles criadas:", { adminRole, providerRole, clientRole });

  // 2. Criar usuário administrador
  console.log("👤 Criando usuário administrador...");
  const hashedPassword = await hash("Admin@FlicApp2024!", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@flicapp.com" },
    update: {},
    create: {
      id: "admin-user-001",
      name: "Administrador FlicApp",
      email: "admin@flicapp.com",
      emailVerified: true,
      role: "ADMINISTRADOR",
      phoneE164: "+5511999999999",
      cpf: "00000000000",
    },
  });

  // Criar conta de autenticação para o admin
  await prisma.account.upsert({
    where: { id: "admin-account-001" },
    update: {},
    create: {
      id: "admin-account-001",
      accountId: adminUser.id,
      providerId: "credentials",
      userId: adminUser.id,
      password: hashedPassword,
    },
  });

  // Atribuir role de administrador
  await prisma.userRoleAssignment.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Usuário administrador criado:", adminUser.email);

  // 3. Criar categorias de serviços
  console.log("🏷️ Criando categorias de serviços...");
  const categories = [
    {
      id: "1cd9adcd-f59d-49f4-adbf-fbe270d1eb43",
      name: "Vidraceiro",
      slug: "vidraceiro",
      active: true,
    },
    {
      id: "1f72d4fb-ba0c-432d-ae65-0565bca38b6f",
      name: "Transporte / Frete",
      slug: "transporte-frete",
      active: true,
    },
    {
      id: "2620e421-4e88-40ed-b759-5be606859e33",
      name: "Gesseiro",
      slug: "gesseiro",
      active: true,
    },
    {
      id: "2da13a68-3c51-4c33-a1bd-049627f1db06",
      name: "Fotógrafo / Filmagem",
      slug: "fotografo-filmagem",
      active: true,
    },
    {
      id: "3d13a67f-8792-4348-ba9a-85da2a2e730b",
      name: "Pedreiro / Reforma",
      slug: "pedreiro-reforma",
      active: true,
    },
    {
      id: "498e5bc9-94b8-4121-8df4-41ae550f2d9b",
      name: "Pintor",
      slug: "pintor",
      active: true,
    },
    {
      id: "4e390fa4-bc90-4599-8f86-53806245504a",
      name: "Personal Trainer",
      slug: "personal-trainer",
      active: true,
    },
    {
      id: "4fb8b926-bf7a-4c92-925e-8ddbbca40a89",
      name: "Beleza - Maquiagem",
      slug: "maquiagem",
      active: true,
    },
    {
      id: "5553dc5d-ab6d-4338-b9e4-47d3fcb60f69",
      name: "Montador de Móveis",
      slug: "montador-de-moveis",
      active: true,
    },
    {
      id: "59b1cc4e-49b9-4fe7-a89a-40327d74aa11",
      name: "Manutenção de Eletrodomésticos",
      slug: "manutencao-eletrodomesticos",
      active: true,
    },
    {
      id: "5f4fc170-cd0b-4913-befa-cd64d121fa90",
      name: "Dedetização",
      slug: "dedetizacao",
      active: true,
    },
    {
      id: "63260ea8-33fc-4177-b1a3-7c5b0936ac7c",
      name: "Jardinagem",
      slug: "jardinagem",
      active: true,
    },
    {
      id: "6bdafa8a-43d1-42c3-8599-d31a6b0e558e",
      name: "Encanador",
      slug: "encanador",
      active: true,
    },
    {
      id: "73c236e8-f68f-4826-98ee-adaf06241898",
      name: "Eventos - Decoração",
      slug: "decoracao-eventos",
      active: true,
    },
    {
      id: "74265db1-6174-4311-bc3a-847a50cccf9d",
      name: "Eventos - Buffet",
      slug: "buffet",
      active: true,
    },
    {
      id: "8756a373-5f8e-461f-baac-f9ab5d846200",
      name: "Piscineiro",
      slug: "piscineiro",
      active: true,
    },
    {
      id: "96671329-f49f-4cdf-9d25-30f240d5c813",
      name: "Designer Gráfico",
      slug: "designer-grafico",
      active: true,
    },
    {
      id: "99006425-00ce-4e20-9d5e-67664f41b0df",
      name: "Chaveiro",
      slug: "chaveiro",
      active: true,
    },
    {
      id: "99366d44-ed4a-45a9-9972-7f907fd2f3e8",
      name: "Serralheiro",
      slug: "serralheiro",
      active: true,
    },
    {
      id: "a223e8ce-d1d1-46a6-bbfe-e0d3d9fa0078",
      name: "Mudança / Carretos",
      slug: "mudanca-carretos",
      active: true,
    },
    {
      id: "b103612a-e678-4a61-92f3-2dd3a1e2c6e8",
      name: "Suporte de Informática",
      slug: "suporte-de-informatica",
      active: true,
    },
    {
      id: "b70f72ab-75ec-46d7-9872-cad907b1f988",
      name: "Funilaria e Pintura Automotiva",
      slug: "funilaria-automotiva",
      active: true,
    },
    {
      id: "ba47f8c1-7ee6-4c43-9c7f-d82fe8082228",
      name: "Mecânico Automotivo",
      slug: "mecanico-automotivo",
      active: true,
    },
    {
      id: "bc4b5787-0830-40dc-a610-92a3e114ba3f",
      name: "Beleza - Cabeleireiro",
      slug: "cabeleireiro",
      active: true,
    },
    {
      id: "c0c1c609-96df-4586-aa1e-fe104467d387",
      name: "Limpeza Residencial",
      slug: "limpeza-residencial",
      active: true,
    },
    {
      id: "c4f30cfb-f117-4b35-9962-13fd9666540b",
      name: "Outros",
      slug: "outros",
      active: true,
    },
    {
      id: "c51d56eb-60b1-4090-82e6-f572ee02de25",
      name: "Eletricista",
      slug: "eletricista",
      active: true,
    },
    {
      id: "cc2cde4c-d2a0-4285-9b2b-ae323138871e",
      name: "Marceneiro",
      slug: "marceneiro",
      active: true,
    },
    {
      id: "d630fa27-d0ac-4e4b-9b6c-a03a1a6de998",
      name: "Beleza - Manicure e Pedicure",
      slug: "manicure-pedicure",
      active: true,
    },
    {
      id: "d8450fba-2c5b-4622-9077-83faaa293c16",
      name: "Eventos - DJ / Som",
      slug: "dj-som",
      active: true,
    },
    {
      id: "e0b70f56-480d-47fc-9ec4-6eca23999fc4",
      name: "Cuidador de Idosos",
      slug: "cuidador-idosos",
      active: true,
    },
    {
      id: "e69b2654-0609-42aa-a654-56fad655ec58",
      name: "Instalador de Ar-Condicionado",
      slug: "instalador-ar-condicionado",
      active: true,
    },
    {
      id: "fa479488-a75f-42aa-9dac-940a508a21f",
      name: "Babá",
      slug: "baba",
      active: true,
    },
    {
      id: "fe0f4831-15c7-4dfd-beb5-d35562e42cc9",
      name: "Professor Particular",
      slug: "professor-particular",
      active: true,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categorias criadas:", categories.length);

  // 4. Criar usuários de exemplo (prestadores e clientes)
  console.log("👥 Criando usuários de exemplo...");

  // Prestador de exemplo
  const providerUser = await prisma.user.upsert({
    where: { email: "joao.prestador@flicapp.com" },
    update: {},
    create: {
      id: "provider-user-001",
      name: "João Silva - Prestador",
      email: "joao.prestador@flicapp.com",
      emailVerified: true,
      role: "PRESTADOR",
      phoneE164: "+5511987654321",
      cpf: "12345678901",
      whatsappId: "joao.prestador",
    },
  });

  // Atribuir role de prestador
  await prisma.userRoleAssignment.upsert({
    where: {
      userId_roleId: {
        userId: providerUser.id,
        roleId: providerRole.id,
      },
    },
    update: {},
    create: {
      userId: providerUser.id,
      roleId: providerRole.id,
    },
  });

  // Perfil do prestador
  await prisma.providerProfile.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      bio: "Prestador experiente em limpeza e manutenção residencial. Mais de 5 anos de experiência.",
      radiusKm: 15,
      avgRating: 4.8,
      totalReviews: 25,
      acceptRate30d: 0.95,
      responseP50S: 120,
      noShow30d: 0,
    },
  });

  // Disponibilidade do prestador (segunda a sexta, 8h às 18h)
  const weekdays = [1, 2, 3, 4, 5]; // Segunda a sexta
  for (const weekday of weekdays) {
    await prisma.providerAvailability.upsert({
      where: {
        providerId_weekday_startTime_endTime: {
          providerId: providerUser.id,
          weekday,
          startTime: "08:00",
          endTime: "18:00",
        },
      },
      update: {},
      create: {
        providerId: providerUser.id,
        weekday,
        startTime: "08:00",
        endTime: "18:00",
      },
    });
  }

  // Categorias do prestador
  const providerCategories = [
    { categoryId: "c0c1c609-96df-4586-aa1e-fe104467d387", minPriceCents: 5000 }, // Limpeza Residencial
    { categoryId: "498e5bc9-94b8-4121-8df4-41ae550f2d9b", minPriceCents: 8000 }, // Pintor
    { categoryId: "63260ea8-33fc-4177-b1a3-7c5b0936ac7c", minPriceCents: 3000 }, // Jardinagem
  ];

  for (const pc of providerCategories) {
    await prisma.providerCategory.upsert({
      where: {
        providerId_categoryId: {
          providerId: providerUser.id,
          categoryId: pc.categoryId,
        },
      },
      update: {},
      create: {
        providerId: providerUser.id,
        categoryId: pc.categoryId,
        minPriceCents: pc.minPriceCents,
        active: true,
        score: 4.5,
        isAvailable: true,
      },
    });
  }

  // Cliente de exemplo
  const clientUser = await prisma.user.upsert({
    where: { email: "maria.cliente@flicapp.com" },
    update: {},
    create: {
      id: "client-user-001",
      name: "Maria Santos - Cliente",
      email: "maria.cliente@flicapp.com",
      emailVerified: true,
      role: "CLIENTE",
      phoneE164: "+5511987654322",
      cpf: "98765432100",
    },
  });

  // Atribuir role de cliente
  await prisma.userRoleAssignment.upsert({
    where: {
      userId_roleId: {
        userId: clientUser.id,
        roleId: clientRole.id,
      },
    },
    update: {},
    create: {
      userId: clientUser.id,
      roleId: clientRole.id,
    },
  });

  // Endereço do cliente
  await prisma.address.upsert({
    where: { id: "address-001" },
    update: {},
    create: {
      id: "address-001",
      userId: clientUser.id,
      label: "Casa Principal",
      cep: "01234-567",
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      lat: -23.5505,
      lon: -46.6333,
    },
  });

  console.log("✅ Usuários de exemplo criados");

  // 5. Criar regras de recusa
  console.log("📜 Criando regras de recusa...");
  const refusalRules = [
    {
      code: "CANCEL_CLIENT_24H",
      clientCreditPct: 100,
      providerPct: 0,
      platformPct: 0,
    },
    {
      code: "CANCEL_CLIENT_2H",
      clientCreditPct: 50,
      providerPct: 25,
      platformPct: 25,
    },
    {
      code: "CANCEL_PROVIDER",
      clientCreditPct: 100,
      providerPct: 0,
      platformPct: 0,
    },
    {
      code: "NO_SHOW_CLIENT",
      clientCreditPct: 0,
      providerPct: 50,
      platformPct: 50,
    },
  ];

  for (const rule of refusalRules) {
    await prisma.refusalRule.upsert({
      where: { code: rule.code },
      update: {},
      create: rule,
    });
  }

  console.log("✅ Regras de recusa criadas");

  // 6. Criar pedido de exemplo
  console.log("📦 Criando pedido de exemplo...");
  const sampleOrder = await prisma.order.upsert({
    where: { id: "order-001" },
    update: {},
    create: {
      id: "order-001",
      clientId: clientUser.id,
      addressId: "address-001",
      categoryId: "c0c1c609-96df-4586-aa1e-fe104467d387", // Limpeza Residencial
      description:
        "Limpeza completa da casa, incluindo cozinha, banheiros e quartos.",
      status: "pending",
      depositMethod: "avg_min_20",
      depositCents: 2000,
      finalPriceCents: 10000,
    },
  });

  // Slots de horário para o pedido
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const slot1 = await prisma.orderSlot.upsert({
    where: { id: "slot-001" },
    update: {},
    create: {
      id: "slot-001",
      orderId: sampleOrder.id,
      label: "Manhã (9h-12h)",
      startAt: tomorrow,
      endAt: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000), // +3 horas
      origin: "client",
      chosen: false,
    },
  });

  await prisma.orderSlot.upsert({
    where: { id: "slot-002" },
    update: {},
    create: {
      id: "slot-002",
      orderId: sampleOrder.id,
      label: "Tarde (14h-17h)",
      startAt: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000), // +5 horas
      endAt: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000), // +8 horas
      origin: "client",
      chosen: false,
    },
  });

  // Convite para o prestador
  await prisma.orderInvitation.upsert({
    where: { id: "invitation-001" },
    update: {},
    create: {
      id: "invitation-001",
      orderId: sampleOrder.id,
      providerId: providerUser.id,
      slotId: slot1.id,
      score: 0.85,
      categorySlug: "limpeza-residencial",
      status: "invited",
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
    },
  });

  console.log("✅ Pedido de exemplo criado");

  console.log("🎉 Seed concluído com sucesso!");
  console.log("\n📊 Resumo dos dados criados:");
  console.log("- 3 Roles (ADMINISTRADOR, PRESTADOR, CLIENTE)");
  console.log("- 1 Usuário Administrador (admin@flicapp.com)");
  console.log("- 1 Prestador de exemplo com perfil e disponibilidade");
  console.log("- 1 Cliente de exemplo com endereço");
  console.log("- 35 Categorias de serviços (todas as categorias do sistema)");
  console.log("- 4 Regras de recusa");
  console.log("- 1 Pedido de exemplo com convites");
  console.log("\n🔑 Credenciais do Admin:");
  console.log("Email: admin@flicapp.com");
  console.log("Senha: Admin@FlicApp2024!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
