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
    byStatusAndMonth: {
      [month: string]: {
        pending: number;
        approved: number;
        rejected: number;
      };
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
  activities: Array<{
    id: string;
    type:
      | "user_registered"
      | "request_approved"
      | "request_rejected"
      | "request_pending"
      | "system_alert";
    title: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
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
