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
      name: "Vidraceiro",
      slug: "vidraceiro",
      active: true,
    },
    {
      name: "Transporte / Frete",
      slug: "transporte-frete",
      active: true,
    },
    {
      name: "Gesseiro",
      slug: "gesseiro",
      active: true,
    },
    {
      name: "Fotógrafo / Filmagem",
      slug: "fotografo-filmagem",
      active: true,
    },
    {
      name: "Pedreiro / Reforma",
      slug: "pedreiro-reforma",
      active: true,
    },
    {
      name: "Pintor",
      slug: "pintor",
      active: true,
    },
    {
      name: "Personal Trainer",
      slug: "personal-trainer",
      active: true,
    },
    {
      name: "Beleza - Maquiagem",
      slug: "maquiagem",
      active: true,
    },
    {
      name: "Montador de Móveis",
      slug: "montador-de-moveis",
      active: true,
    },
    {
      name: "Manutenção de Eletrodomésticos",
      slug: "manutencao-eletrodomesticos",
      active: true,
    },
    {
      name: "Dedetização",
      slug: "dedetizacao",
      active: true,
    },
    {
      name: "Jardinagem",
      slug: "jardinagem",
      active: true,
    },
    {
      name: "Encanador",
      slug: "encanador",
      active: true,
    },
    {
      name: "Eventos - Decoração",
      slug: "decoracao-eventos",
      active: true,
    },
    {
      name: "Eventos - Buffet",
      slug: "buffet",
      active: true,
    },
    {
      name: "Piscineiro",
      slug: "piscineiro",
      active: true,
    },
    {
      name: "Designer Gráfico",
      slug: "designer-grafico",
      active: true,
    },
    {
      name: "Chaveiro",
      slug: "chaveiro",
      active: true,
    },
    {
      name: "Serralheiro",
      slug: "serralheiro",
      active: true,
    },
    {
      name: "Mudança / Carretos",
      slug: "mudanca-carretos",
      active: true,
    },
    {
      name: "Suporte de Informática",
      slug: "suporte-de-informatica",
      active: true,
    },
    {
      name: "Funilaria e Pintura Automotiva",
      slug: "funilaria-automotiva",
      active: true,
    },
    {
      name: "Mecânico Automotivo",
      slug: "mecanico-automotivo",
      active: true,
    },
    {
      name: "Beleza - Cabeleireiro",
      slug: "cabeleireiro",
      active: true,
    },
    {
      name: "Limpeza Residencial",
      slug: "limpeza-residencial",
      active: true,
    },
    {
      name: "Outros",
      slug: "outros",
      active: true,
    },
    {
      name: "Eletricista",
      slug: "eletricista",
      active: true,
    },
    {
      name: "Marceneiro",
      slug: "marceneiro",
      active: true,
    },
    {
      name: "Beleza - Manicure e Pedicure",
      slug: "manicure-pedicure",
      active: true,
    },
    {
      name: "Eventos - DJ / Som",
      slug: "dj-som",
      active: true,
    },
    {
      name: "Cuidador de Idosos",
      slug: "cuidador-idosos",
      active: true,
    },
    {
      name: "Instalador de Ar-Condicionado",
      slug: "instalador-ar-condicionado",
      active: true,
    },
    {
      name: "Babá",
      slug: "baba",
      active: true,
    },
    {
      name: "Professor Particular",
      slug: "professor-particular",
      active: true,
    },
  ];

  // Criar categorias e armazenar seus IDs
  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        active: category.active,
      },
    });
    categoryMap.set(category.slug, created.id);
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
    { categorySlug: "limpeza-residencial", minPriceCents: 5000 },
    { categorySlug: "pintor", minPriceCents: 8000 },
    { categorySlug: "jardinagem", minPriceCents: 3000 },
  ];

  for (const pc of providerCategories) {
    const categoryId = categoryMap.get(pc.categorySlug);
    if (!categoryId) {
      throw new Error(`Categoria não encontrada: ${pc.categorySlug}`);
    }
    await prisma.providerCategory.upsert({
      where: {
        providerId_categoryId: {
          providerId: providerUser.id,
          categoryId: categoryId,
        },
      },
      update: {},
      create: {
        providerId: providerUser.id,
        categoryId: categoryId,
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
  let clientAddress = await prisma.address.findFirst({
    where: { userId: clientUser.id, label: "Casa Principal" },
  });

  if (!clientAddress) {
    clientAddress = await prisma.address.create({
      data: {
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
  }

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
  let sampleOrder = await prisma.order.findFirst({
    where: {
      clientId: clientUser.id,
      description:
        "Limpeza completa da casa, incluindo cozinha, banheiros e quartos.",
    },
  });

  if (!sampleOrder) {
    sampleOrder = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("limpeza-residencial")!,
        description:
          "Limpeza completa da casa, incluindo cozinha, banheiros e quartos.",
        status: "pending",
        depositMethod: "avg_min_20",
        depositCents: 2000,
        finalPriceCents: 10000,
      },
    });
  }

  // Slots de horário para o pedido
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  let slot1 = await prisma.orderSlot.findFirst({
    where: {
      orderId: sampleOrder.id,
      label: "Manhã (9h-12h)",
    },
  });

  if (!slot1) {
    slot1 = await prisma.orderSlot.create({
      data: {
        orderId: sampleOrder.id,
        label: "Manhã (9h-12h)",
        startAt: tomorrow,
        endAt: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000), // +3 horas
        origin: "client",
        chosen: false,
      },
    });
  }

  let slot2 = await prisma.orderSlot.findFirst({
    where: {
      orderId: sampleOrder.id,
      label: "Tarde (14h-17h)",
    },
  });

  if (!slot2) {
    slot2 = await prisma.orderSlot.create({
      data: {
        orderId: sampleOrder.id,
        label: "Tarde (14h-17h)",
        startAt: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000), // +5 horas
        endAt: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000), // +8 horas
        origin: "client",
        chosen: false,
      },
    });
  }

  // Convite para o prestador
  await prisma.orderInvitation.upsert({
    where: {
      orderId_providerId: {
        orderId: sampleOrder.id,
        providerId: providerUser.id,
      },
    },
    update: {},
    create: {
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
  let completedOrder1 = await prisma.order.findFirst({
    where: {
      clientId: clientUser.id,
      description:
        "Limpeza completa da casa, incluindo cozinha, banheiros e quartos. Serviço excelente!",
    },
  });

  if (!completedOrder1) {
    completedOrder1 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("limpeza-residencial")!,
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
  }

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
  let completedOrder2 = await prisma.order.findFirst({
    where: {
      clientId: clientUser.id,
      description:
        "Pintura da sala e quarto principal. Cores escolhidas: azul claro e branco.",
    },
  });

  if (!completedOrder2) {
    completedOrder2 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("pintor")!,
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
  }

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
  let completedOrder3 = await prisma.order.findFirst({
    where: {
      clientId: clientUser.id,
      description:
        "Poda das plantas e limpeza do jardim. Manutenção geral da área externa.",
    },
  });

  if (!completedOrder3) {
    completedOrder3 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("jardinagem")!,
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
  }

  // Pedido cancelado
  let cancelledOrder1 = await prisma.order.findFirst({
    where: {
      clientId: clientUser.id,
      description:
        "Reparo no vazamento da torneira da cozinha. Cancelado por indisponibilidade do prestador.",
    },
  });

  if (!cancelledOrder1) {
    cancelledOrder1 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("encanador")!,
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
  }

  // Pedido concluído com avaliação baixa
  let completedOrder4 = await prisma.order.findFirst({
    where: {
      clientId: clientUser.id,
      description:
        "Instalação de ventilador no quarto. Problema com a fiação antiga.",
    },
  });

  if (!completedOrder4) {
    completedOrder4 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("eletricista")!,
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
  }

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
  let completedOrder5 = await prisma.order.findFirst({
    where: {
      clientId: clientUser.id,
      description: "Corte e escova. Cabelo médio, corte moderno.",
    },
  });

  if (!completedOrder5) {
    completedOrder5 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("cabeleireiro")!,
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
  }

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
  let cancelledOrder2 = await prisma.order.findFirst({
    where: {
      clientId: clientUser.id,
      description: "Reparo na geladeira. Cancelado por mudança de planos.",
    },
  });

  if (!cancelledOrder2) {
    cancelledOrder2 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("manutencao-eletrodomesticos")!,
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
  }

  console.log("✅ Pedidos de histórico criados para a cliente");

  // 8. Criar pedidos de exemplo para o prestador (histórico)
  console.log("📦 Criando pedidos de histórico para o prestador...");

  // Pedidos concluídos para o prestador
  let providerCompletedOrder1 = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description:
        "Limpeza completa da casa, incluindo cozinha, banheiros e quartos.",
      slotStart: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  });

  if (!providerCompletedOrder1) {
    providerCompletedOrder1 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("limpeza-residencial")!,
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
  }

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

  let providerCompletedOrder2 = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description:
        "Pintura da sala e quarto principal. Cores escolhidas: azul claro e branco.",
      slotStart: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
  });

  if (!providerCompletedOrder2) {
    providerCompletedOrder2 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("pintor")!,
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
  }

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

  let providerCompletedOrder3 = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description:
        "Poda das plantas e limpeza do jardim. Manutenção geral da área externa.",
      slotStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  if (!providerCompletedOrder3) {
    providerCompletedOrder3 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("jardinagem")!,
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
  }

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

  let providerCompletedOrder4 = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description:
        "Limpeza pós-reforma. Remoção de poeira e resíduos de construção.",
    },
  });

  if (!providerCompletedOrder4) {
    providerCompletedOrder4 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("limpeza-residencial")!,
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
  }

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

  let providerCompletedOrder5 = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description: "Pintura do quarto e banheiro. Cores neutras e modernas.",
    },
  });

  if (!providerCompletedOrder5) {
    providerCompletedOrder5 = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("pintor")!,
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
  }

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
  let providerInProgressOrder = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description: "Limpeza semanal da casa. Manutenção geral dos ambientes.",
      status: "in_progress",
    },
  });

  if (!providerInProgressOrder) {
    providerInProgressOrder = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("limpeza-residencial")!,
        description: "Limpeza semanal da casa. Manutenção geral dos ambientes.",
        status: "in_progress",
        depositMethod: "avg_min_20",
        depositCents: 1000,
        finalPriceCents: 5000,
        slotStart: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas no futuro
        slotEnd: new Date(Date.now() + 2 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      },
    });
  }

  // Pedido aceito (aguardando início)
  let providerAcceptedOrder = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description:
        "Poda de árvores e limpeza do jardim. Trabalho de manutenção.",
      status: "accepted",
    },
  });

  if (!providerAcceptedOrder) {
    providerAcceptedOrder = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("jardinagem")!,
        description:
          "Poda de árvores e limpeza do jardim. Trabalho de manutenção.",
        status: "accepted",
        depositMethod: "avg_min_20",
        depositCents: 2000,
        finalPriceCents: 10000,
        slotStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 dia no futuro
        slotEnd: new Date(
          Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
        ),
      },
    });
  }

  // Pedido pendente (matching)
  let providerPendingOrder = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description: "Pintura da fachada da casa. Cores claras e modernas.",
      status: "matching",
    },
  });

  if (!providerPendingOrder) {
    providerPendingOrder = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("pintor")!,
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
  }

  // Pedido cancelado pelo prestador
  let providerCancelledOrder = await prisma.order.findFirst({
    where: {
      providerId: providerUser.id,
      description: "Instalação de ventilador. Cancelado por indisponibilidade.",
      status: "cancelled",
    },
  });

  if (!providerCancelledOrder) {
    providerCancelledOrder = await prisma.order.create({
      data: {
        clientId: clientUser.id,
        providerId: providerUser.id,
        addressId: clientAddress.id,
        categoryId: categoryMap.get("eletricista")!,
        description:
          "Instalação de ventilador. Cancelado por indisponibilidade.",
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
  }

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
