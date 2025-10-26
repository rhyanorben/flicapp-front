export interface StatisticsData {
  users: {
    total: number;
    admins: number;
    providers: number;
    clients: number;
    byMonth: {
      [month: string]: number;
    };
  };
  providerRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byMonth: {
      [month: string]: number;
    };
    recent: Array<{
      id: string;
      userId: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
      status: string;
      createdAt: string;
    }>;
  };
}

export async function getStatistics(): Promise<StatisticsData> {
  const response = await fetch("/api/admin/statistics");

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Acesso negado");
    }
    throw new Error("Erro ao buscar estatísticas");
  }

  return response.json();
}
