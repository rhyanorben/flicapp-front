// Mock data for different user roles

export const clientMockData = {
  services: {
    total: 45,
    inProgress: 3,
    completed: 42,
    cancelled: 0,
  },
  favorites: 12,
  pendingReviews: 2,
  monthlyRequests: {
    Jan: 8,
    Fev: 12,
    Mar: 15,
    Abr: 18,
    Mai: 22,
    Jun: 20,
  },
  categoriesDistribution: {
    Limpeza: 15,
    Reparos: 12,
    Consultoria: 8,
    Outros: 10,
  },
  recentOrders: [
    {
      id: "1",
      service: "Limpeza Residencial",
      provider: "Maria Silva",
      status: "IN_PROGRESS",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      service: "Reparo Elétrico",
      provider: "João Santos",
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      service: "Consultoria Técnica",
      provider: "Ana Costa",
      status: "PENDING",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      scheduledDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ],
  favoriteProviders: [
    { name: "Maria Silva", rating: 4.9, services: 8 },
    { name: "João Santos", rating: 4.8, services: 5 },
    { name: "Ana Costa", rating: 4.7, services: 3 },
  ],
  upcomingSchedules: [
    {
      id: "1",
      service: "Limpeza Residencial",
      provider: "Maria Silva",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      time: "14:00",
    },
    {
      id: "2",
      service: "Consultoria Técnica",
      provider: "Ana Costa",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      time: "10:00",
    },
  ],
  tips: [
    "Dica: Avalie seus prestadores para ajudar outros clientes",
    "Você pode favoritar prestadores que mais gostou",
    "Agende serviços com antecedência para garantir disponibilidade",
  ],
};

export const providerMockData = {
  requests: {
    total: 156,
    pending: 8,
    accepted: 120,
    completed: 110,
    rejected: 10,
  },
  rating: 4.8,
  totalReviews: 89,
  acceptanceRate: 85,
  monthlyTrend: {
    Jan: 12,
    Fev: 18,
    Mar: 25,
    Abr: 30,
    Mai: 35,
    Jun: 32,
  },
  statusDistribution: {
    pending: 8,
    accepted: 15,
    completed: 110,
    cancelled: 5,
  },
  upcomingSchedules: [
    {
      id: "1",
      client: "Carlos Lima",
      service: "Limpeza Residencial",
      date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      time: "14:00",
      address: "Rua das Flores, 123",
    },
    {
      id: "2",
      client: "Ana Paula",
      service: "Reparo Elétrico",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      time: "09:00",
      address: "Av. Principal, 456",
    },
  ],
  recentRequests: [
    {
      id: "1",
      client: { name: "Pedro Costa", email: "pedro@email.com" },
      service: "Limpeza Comercial",
      status: "PENDING",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      description: "Limpeza de escritório 200m²",
    },
    {
      id: "2",
      client: { name: "Maria Santos", email: "maria@email.com" },
      service: "Reparo Hidráulico",
      status: "ACCEPTED",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      description: "Vazamento na cozinha",
    },
    {
      id: "3",
      client: { name: "João Silva", email: "joao@email.com" },
      service: "Consultoria Técnica",
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Avaliação de sistema elétrico",
    },
  ],
  recentReviews: [
    {
      id: "1",
      client: "Carlos Lima",
      rating: 5,
      comment: "Excelente trabalho! Muito profissional e pontual.",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      client: "Ana Paula",
      rating: 4,
      comment: "Bom serviço, recomendo!",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      client: "Pedro Costa",
      rating: 5,
      comment: "Superou minhas expectativas. Voltarei a contratar!",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  monthlyGoals: {
    services: { target: 40, current: 35, percentage: 87.5 },
    rating: { target: 4.5, current: 4.8, percentage: 100 },
    completion: { target: 90, current: 91.7, percentage: 100 },
  },
};

export const adminMockData = {
  users: {
    total: 1247,
    admins: 12,
    providers: 234,
    clients: 1001,
    byMonth: {
      Jan: 45,
      Fev: 67,
      Mar: 89,
      Abr: 123,
      Mai: 156,
      Jun: 189,
    },
  },
  requests: {
    total: 456,
    pending: 23,
    approved: 398,
    rejected: 35,
    byMonth: {
      Jan: 12,
      Fev: 18,
      Mar: 25,
      Abr: 34,
      Mai: 42,
      Jun: 38,
    },
  },
  recentActivity: [
    {
      id: "1",
      type: "user_registered",
      title: "Novo usuário cadastrado",
      description: "João Silva se cadastrou como cliente",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      user: "João Silva",
    },
    {
      id: "2",
      type: "request_approved",
      title: "Solicitação aprovada",
      description: "Maria Santos foi aprovada como prestadora",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      user: "Maria Santos",
    },
    {
      id: "3",
      type: "request_pending",
      title: "Nova solicitação",
      description: "Pedro Costa solicitou tornar-se prestador",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      user: "Pedro Costa",
    },
  ],
  recentRequests: [
    {
      id: "1",
      user: { name: "Ana Oliveira", email: "ana@email.com" },
      status: "PENDING",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      user: { name: "Carlos Lima", email: "carlos@email.com" },
      status: "APPROVED",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      user: { name: "Maria Santos", email: "maria@email.com" },
      status: "REJECTED",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
};
