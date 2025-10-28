import { PrismaClient, UserRole } from "../src/app/generated/prisma";
import { auth } from "../src/lib/auth";

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

  // 2. Criar usuário administrador usando Better Auth
  console.log("👤 Criando usuário administrador...");

  // Verificar se o usuário já existe
  let adminUser = await prisma.user.findUnique({
    where: { email: "admin@flicapp.com" },
  });

  if (!adminUser) {
    // Criar usuário usando Better Auth
    const signUpResponse = await auth.api.signUpEmail({
      body: {
        email: "admin@flicapp.com",
        password: "Admin@FlicApp2024!",
        name: "Administrador FlicApp",
      },
    });

    if (!signUpResponse || !signUpResponse.user) {
      throw new Error("Falha ao criar usuário administrador");
    }

    adminUser = await prisma.user.findUnique({
      where: { email: "admin@flicapp.com" },
    });

    if (!adminUser) {
      throw new Error("Usuário administrador não encontrado após criação");
    }
  }

  // Atualizar dados adicionais do admin
  adminUser = await prisma.user.update({
    where: { id: adminUser.id },
    data: {
      role: "ADMINISTRADOR",
      phoneE164: "+5511999999999",
      cpf: "00000000000",
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
  let providerUser = await prisma.user.findUnique({
    where: { email: "joao.prestador@flicapp.com" },
  });

  if (!providerUser) {
    // Criar prestador usando Better Auth
    const providerSignUpResponse = await auth.api.signUpEmail({
      body: {
        email: "joao.prestador@flicapp.com",
        password: "JoaoPrestador2024!",
        name: "João Silva - Prestador",
      },
    });

    if (!providerSignUpResponse || !providerSignUpResponse.user) {
      throw new Error("Falha ao criar usuário prestador");
    }

    providerUser = await prisma.user.findUnique({
      where: { email: "joao.prestador@flicapp.com" },
    });

    if (!providerUser) {
      throw new Error("Usuário prestador não encontrado após criação");
    }
  }

  // Atualizar dados adicionais do prestador
  providerUser = await prisma.user.update({
    where: { id: providerUser.id },
    data: {
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
  let clientUser = await prisma.user.findUnique({
    where: { email: "maria.cliente@flicapp.com" },
  });

  if (!clientUser) {
    // Criar cliente usando Better Auth
    const clientSignUpResponse = await auth.api.signUpEmail({
      body: {
        email: "maria.cliente@flicapp.com",
        password: "MariaCliente2024!",
        name: "Maria Santos - Cliente",
      },
    });

    if (!clientSignUpResponse || !clientSignUpResponse.user) {
      throw new Error("Falha ao criar usuário cliente");
    }

    clientUser = await prisma.user.findUnique({
      where: { email: "maria.cliente@flicapp.com" },
    });

    if (!clientUser) {
      throw new Error("Usuário cliente não encontrado após criação");
    }
  }

  // Atualizar dados adicionais do cliente
  clientUser = await prisma.user.update({
    where: { id: clientUser.id },
    data: {
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

  // 7. Criar pedidos de exemplo para a cliente (histórico)
  console.log("📦 Criando pedidos de histórico para a cliente...");

  // Pedido concluído com avaliação
  const completedOrder1 = await prisma.order.upsert({
    where: { id: "order-completed-001" },
    update: {},
    create: {
      id: "order-completed-001",
      clientId: clientUser.id,
      addressId: "address-001",
      categoryId: "c0c1c609-96df-4586-aa1e-fe104467d387", // Limpeza Residencial
      description:
        "Limpeza completa da casa, incluindo cozinha, banheiros e quartos. Serviço excelente!",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 2000,
      finalPriceCents: 10000,
      slotStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      slotEnd: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ), // +3 horas
    },
  });

  // Avaliação do pedido concluído
  await prisma.orderReview.upsert({
    where: { orderId: completedOrder1.id },
    update: {},
    create: {
      orderId: completedOrder1.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 5,
      comment: "Excelente trabalho! Muito pontual e organizado. Recomendo!",
    },
  });

  // Pedido concluído com avaliação
  const completedOrder2 = await prisma.order.upsert({
    where: { id: "order-completed-002" },
    update: {},
    create: {
      id: "order-completed-002",
      clientId: clientUser.id,
      addressId: "address-001",
      categoryId: "498e5bc9-94b8-4121-8df4-41ae550f2d9b", // Pintor
      description:
        "Pintura da sala e quarto principal. Cores escolhidas: azul claro e branco.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 5000,
      finalPriceCents: 25000,
      slotStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 dias atrás
      slotEnd: new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000
      ), // +6 horas
    },
  });

  // Avaliação do segundo pedido concluído
  await prisma.orderReview.upsert({
    where: { orderId: completedOrder2.id },
    update: {},
    create: {
      orderId: completedOrder2.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 4,
      comment: "Bom trabalho, mas demorou um pouco mais que o esperado.",
    },
  });

  // Pedido concluído sem avaliação
  await prisma.order.upsert({
    where: { id: "order-completed-003" },
    update: {},
    create: {
      id: "order-completed-003",
      clientId: clientUser.id,
      addressId: "address-001",
      categoryId: "63260ea8-33fc-4177-b1a3-7c5b0936ac7c", // Jardinagem
      description:
        "Poda das plantas e limpeza do jardim. Manutenção geral da área externa.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 1500,
      finalPriceCents: 7500,
      slotStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
      slotEnd: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ), // +2 horas
    },
  });

  // Pedido cancelado
  await prisma.order.upsert({
    where: { id: "order-cancelled-001" },
    update: {},
    create: {
      id: "order-cancelled-001",
      clientId: clientUser.id,
      addressId: "address-001",
      categoryId: "6bdafa8a-43d1-42c3-8599-d31a6b0e558e", // Encanador
      description:
        "Reparo no vazamento da torneira da cozinha. Cancelado por indisponibilidade do prestador.",
      status: "cancelled",
      depositMethod: "avg_min_20",
      depositCents: 1000,
      finalPriceCents: 5000,
      slotStart: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 dias atrás
      slotEnd: new Date(
        Date.now() - 20 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000
      ), // +1 hora
    },
  });

  // Pedido concluído com avaliação baixa
  const completedOrder4 = await prisma.order.upsert({
    where: { id: "order-completed-004" },
    update: {},
    create: {
      id: "order-completed-004",
      clientId: clientUser.id,
      addressId: "address-001",
      categoryId: "c51d56eb-60b1-4090-82e6-f572ee02de25", // Eletricista
      description:
        "Instalação de ventilador no quarto. Problema com a fiação antiga.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 3000,
      finalPriceCents: 15000,
      slotStart: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 dias atrás
      slotEnd: new Date(
        Date.now() - 45 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ), // +2 horas
    },
  });

  // Avaliação do quarto pedido concluído
  await prisma.orderReview.upsert({
    where: { orderId: completedOrder4.id },
    update: {},
    create: {
      orderId: completedOrder4.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 3,
      comment:
        "Serviço realizado, mas demorou muito e não foi muito organizado.",
    },
  });

  // Pedido concluído com avaliação
  const completedOrder5 = await prisma.order.upsert({
    where: { id: "order-completed-005" },
    update: {},
    create: {
      id: "order-completed-005",
      clientId: clientUser.id,
      addressId: "address-001",
      categoryId: "bc4b5787-0830-40dc-a610-92a3e114ba3f", // Cabeleireiro
      description: "Corte e escova. Cabelo médio, corte moderno.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 800,
      finalPriceCents: 4000,
      slotStart: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      slotEnd: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000
      ), // +1 hora
    },
  });

  // Avaliação do quinto pedido concluído
  await prisma.orderReview.upsert({
    where: { orderId: completedOrder5.id },
    update: {},
    create: {
      orderId: completedOrder5.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 5,
      comment: "Perfeito! Corte exatamente como eu queria. Muito profissional!",
    },
  });

  // Pedido cancelado recente
  await prisma.order.upsert({
    where: { id: "order-cancelled-002" },
    update: {},
    create: {
      id: "order-cancelled-002",
      clientId: clientUser.id,
      addressId: "address-001",
      categoryId: "59b1cc4e-49b9-4fe7-a89a-40327d74aa11", // Manutenção de Eletrodomésticos
      description: "Reparo na geladeira. Cancelado por mudança de planos.",
      status: "cancelled",
      depositMethod: "avg_min_20",
      depositCents: 2000,
      finalPriceCents: 10000,
      slotStart: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      slotEnd: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ), // +2 horas
    },
  });

  console.log("✅ Pedidos de histórico criados para a cliente");

  // 8. Criar pedidos de exemplo para o prestador (histórico)
  console.log("📦 Criando pedidos de histórico para o prestador...");

  // Pedidos concluídos para o prestador
  const providerCompletedOrder1 = await prisma.order.upsert({
    where: { id: "provider-order-completed-001" },
    update: {},
    create: {
      id: "provider-order-completed-001",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "c0c1c609-96df-4586-aa1e-fe104467d387", // Limpeza Residencial
      description:
        "Limpeza completa da casa, incluindo cozinha, banheiros e quartos.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 2000,
      finalPriceCents: 10000,
      slotStart: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 dias atrás
      slotEnd: new Date(
        Date.now() - 60 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ),
    },
  });

  // Avaliação do primeiro pedido do prestador
  await prisma.orderReview.upsert({
    where: { orderId: providerCompletedOrder1.id },
    update: {},
    create: {
      orderId: providerCompletedOrder1.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 5,
      comment: "Excelente trabalho! Muito pontual e organizado. Recomendo!",
    },
  });

  const providerCompletedOrder2 = await prisma.order.upsert({
    where: { id: "provider-order-completed-002" },
    update: {},
    create: {
      id: "provider-order-completed-002",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "498e5bc9-94b8-4121-8df4-41ae550f2d9b", // Pintor
      description:
        "Pintura da sala e quarto principal. Cores escolhidas: azul claro e branco.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 5000,
      finalPriceCents: 25000,
      slotStart: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 dias atrás
      slotEnd: new Date(
        Date.now() - 45 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000
      ),
    },
  });

  await prisma.orderReview.upsert({
    where: { orderId: providerCompletedOrder2.id },
    update: {},
    create: {
      orderId: providerCompletedOrder2.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 4,
      comment: "Bom trabalho, mas demorou um pouco mais que o esperado.",
    },
  });

  const providerCompletedOrder3 = await prisma.order.upsert({
    where: { id: "provider-order-completed-003" },
    update: {},
    create: {
      id: "provider-order-completed-003",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "63260ea8-33fc-4177-b1a3-7c5b0936ac7c", // Jardinagem
      description:
        "Poda das plantas e limpeza do jardim. Manutenção geral da área externa.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 1500,
      finalPriceCents: 7500,
      slotStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      slotEnd: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ),
    },
  });

  await prisma.orderReview.upsert({
    where: { orderId: providerCompletedOrder3.id },
    update: {},
    create: {
      orderId: providerCompletedOrder3.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 5,
      comment: "Perfeito! Jardim ficou lindo. Muito profissional!",
    },
  });

  const providerCompletedOrder4 = await prisma.order.upsert({
    where: { id: "provider-order-completed-004" },
    update: {},
    create: {
      id: "provider-order-completed-004",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "c0c1c609-96df-4586-aa1e-fe104467d387", // Limpeza Residencial
      description:
        "Limpeza pós-reforma. Remoção de poeira e resíduos de construção.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 3000,
      finalPriceCents: 15000,
      slotStart: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 dias atrás
      slotEnd: new Date(
        Date.now() - 20 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
      ),
    },
  });

  await prisma.orderReview.upsert({
    where: { orderId: providerCompletedOrder4.id },
    update: {},
    create: {
      orderId: providerCompletedOrder4.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 5,
      comment:
        "Trabalho excepcional! Casa ficou impecável. Superou expectativas!",
    },
  });

  const providerCompletedOrder5 = await prisma.order.upsert({
    where: { id: "provider-order-completed-005" },
    update: {},
    create: {
      id: "provider-order-completed-005",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "498e5bc9-94b8-4121-8df4-41ae550f2d9b", // Pintor
      description: "Pintura do quarto e banheiro. Cores neutras e modernas.",
      status: "completed",
      depositMethod: "avg_min_20",
      depositCents: 4000,
      finalPriceCents: 20000,
      slotStart: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
      slotEnd: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000
      ),
    },
  });

  await prisma.orderReview.upsert({
    where: { orderId: providerCompletedOrder5.id },
    update: {},
    create: {
      orderId: providerCompletedOrder5.id,
      clientId: clientUser.id,
      providerId: providerUser.id,
      rating: 4,
      comment: "Boa qualidade, mas poderia ter sido mais rápido.",
    },
  });

  // Pedido em andamento para o prestador
  await prisma.order.upsert({
    where: { id: "provider-order-in-progress-001" },
    update: {},
    create: {
      id: "provider-order-in-progress-001",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "c0c1c609-96df-4586-aa1e-fe104467d387", // Limpeza Residencial
      description: "Limpeza semanal da casa. Manutenção geral dos ambientes.",
      status: "in_progress",
      depositMethod: "avg_min_20",
      depositCents: 1000,
      finalPriceCents: 5000,
      slotStart: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas no futuro
      slotEnd: new Date(Date.now() + 2 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    },
  });

  // Pedido aceito (aguardando início)
  await prisma.order.upsert({
    where: { id: "provider-order-accepted-001" },
    update: {},
    create: {
      id: "provider-order-accepted-001",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "63260ea8-33fc-4177-b1a3-7c5b0936ac7c", // Jardinagem
      description:
        "Poda de árvores e limpeza do jardim. Trabalho de manutenção.",
      status: "accepted",
      depositMethod: "avg_min_20",
      depositCents: 2000,
      finalPriceCents: 10000,
      slotStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 dia no futuro
      slotEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    },
  });

  // Pedido pendente (matching)
  await prisma.order.upsert({
    where: { id: "provider-order-pending-001" },
    update: {},
    create: {
      id: "provider-order-pending-001",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "498e5bc9-94b8-4121-8df4-41ae550f2d9b", // Pintor
      description: "Pintura da fachada da casa. Cores claras e modernas.",
      status: "matching",
      depositMethod: "avg_min_20",
      depositCents: 6000,
      finalPriceCents: 30000,
      slotStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias no futuro
      slotEnd: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
      ),
    },
  });

  // Pedido cancelado pelo prestador
  await prisma.order.upsert({
    where: { id: "provider-order-cancelled-001" },
    update: {},
    create: {
      id: "provider-order-cancelled-001",
      clientId: clientUser.id,
      providerId: providerUser.id,
      addressId: "address-001",
      categoryId: "c51d56eb-60b1-4090-82e6-f572ee02de25", // Eletricista
      description: "Instalação de ventilador. Cancelado por indisponibilidade.",
      status: "cancelled",
      depositMethod: "avg_min_20",
      depositCents: 2000,
      finalPriceCents: 10000,
      slotStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
      slotEnd: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ),
    },
  });

  // Atualizar perfil do prestador com dados reais
  await prisma.providerProfile.update({
    where: { userId: providerUser.id },
    data: {
      avgRating: 4.6, // Média das avaliações
      totalReviews: 5, // Total de avaliações
      acceptRate30d: 0.8, // 80% de aceitação
      responseP50S: 90, // 90 segundos de resposta média
      noShow30d: 0, // Sem faltas
    },
  });

  console.log("✅ Pedidos de histórico criados para o prestador");

  console.log("🎉 Seed concluído com sucesso!");
  console.log("\n📊 Resumo dos dados criados:");
  console.log("- 3 Roles (ADMINISTRADOR, PRESTADOR, CLIENTE)");
  console.log("- 3 Usuários com contas de autenticação");
  console.log("- 35 Categorias de serviços (todas as categorias do sistema)");
  console.log("- 4 Regras de recusa");
  console.log("- 1 Pedido de exemplo com convites");
  console.log(
    "- 7 Pedidos de histórico para a cliente (5 concluídos, 2 cancelados)"
  );
  console.log("- 4 Avaliações de pedidos concluídos");
  console.log(
    "- 8 Pedidos de histórico para o prestador (5 concluídos, 1 em andamento, 1 aceito, 1 pendente, 1 cancelado)"
  );
  console.log("- 5 Avaliações de pedidos do prestador");
  console.log("\n🔑 Credenciais dos Usuários:");
  console.log("👤 ADMINISTRADOR:");
  console.log("   Email: admin@flicapp.com");
  console.log("   Senha: Admin@FlicApp2024!");
  console.log("\n🔧 PRESTADOR:");
  console.log("   Email: joao.prestador@flicapp.com");
  console.log("   Senha: JoaoPrestador2024!");
  console.log("\n👥 CLIENTE:");
  console.log("   Email: maria.cliente@flicapp.com");
  console.log("   Senha: MariaCliente2024!");
  console.log("\n📈 Dados de Histórico da Cliente:");
  console.log("- 5 pedidos concluídos (R$ 615,00 total gasto)");
  console.log("- 2 pedidos cancelados");
  console.log("- Avaliação média: 4,25/5");
  console.log("- 1 pedido sem avaliação (pode ser avaliado)");
  console.log("\n📈 Dados de Histórico do Prestador:");
  console.log("- 5 pedidos concluídos (R$ 77.500,00 total ganho)");
  console.log("- 1 pedido em andamento");
  console.log("- 1 pedido aceito (aguardando início)");
  console.log("- 1 pedido pendente (matching)");
  console.log("- 1 pedido cancelado");
  console.log("- Avaliação média: 4,6/5");
  console.log("- Taxa de aceitação: 80%");
  console.log("- Tempo médio de resposta: 90 segundos");
  console.log("- 0 faltas nos últimos 30 dias");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
