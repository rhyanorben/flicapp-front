import { useQuery } from "@tanstack/react-query";

// Admin Dashboard Data
interface AdminDashboardData {
  users: {
    total: number;
    admins: number;
    providers: number;
    clients: number;
    byMonth: { [month: string]: number };
  };
  providerRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byMonth: { [month: string]: number };
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

// Client Dashboard Data
interface ClientDashboardData {
  services: {
    total: number;
    inProgress: number;
    completed: number;
    favorites: number;
  };
  monthlyRequests: { [month: string]: number };
  categoriesDistribution: { [category: string]: number };
  recentOrders: Array<{
    id: string;
    service: string;
    provider: string;
    status: "IN_PROGRESS" | "COMPLETED" | "PENDING";
    createdAt: string;
  }>;
  favoriteProviders: Array<{
    name: string;
    rating: number;
    services: number;
  }>;
  upcomingSchedules: Array<{
    id: string;
    service: string;
    provider: string;
    time: string;
  }>;
  pendingReviews: number;
  tips: string[];
}

// Provider Dashboard Data
interface ProviderDashboardData {
  requests: {
    total: number;
    pending: number;
    accepted: number;
    completed: number;
    rejected: number;
  };
  rating: number;
  totalReviews: number;
  acceptanceRate: number;
  monthlyTrend: { [month: string]: number };
  statusDistribution: {
    pending: number;
    accepted: number;
    completed: number;
    cancelled: number;
  };
  upcomingSchedules: Array<{
    id: string;
    client: string;
    service: string;
    date: string;
    time: string;
    address: string;
  }>;
  recentRequests: Array<{
    id: string;
    client: { name: string; email: string };
    service: string;
    status: string;
    createdAt: string;
    description: string;
  }>;
  recentReviews: Array<{
    id: string;
    client: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  monthlyGoals: {
    services: { target: number; current: number; percentage: number };
    rating: { target: number; current: number; percentage: number };
    completion: { target: number; current: number; percentage: number };
  };
}

interface DashboardFilters {
  period?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Admin Dashboard Hook
export const useAdminDashboard = (filters?: DashboardFilters) => {
  return useQuery<AdminDashboardData, Error>({
    queryKey: ["adminDashboard", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.period) params.append("period", filters.period);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
      if (filters?.dateTo) params.append("dateTo", filters.dateTo.toISOString());
      
      const queryString = params.toString();
      const url = `/api/dashboard/admin${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch admin dashboard data");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Client Dashboard Hook
export const useClientDashboard = (filters?: DashboardFilters) => {
  return useQuery<ClientDashboardData, Error>({
    queryKey: ["clientDashboard", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.period) params.append("period", filters.period);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
      if (filters?.dateTo) params.append("dateTo", filters.dateTo.toISOString());
      
      const queryString = params.toString();
      const url = `/api/dashboard/client${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch client dashboard data");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Provider Dashboard Hook
export const useProviderDashboard = (filters?: DashboardFilters) => {
  return useQuery<ProviderDashboardData, Error>({
    queryKey: ["providerDashboard", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.period) params.append("period", filters.period);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
      if (filters?.dateTo) params.append("dateTo", filters.dateTo.toISOString());
      
      const queryString = params.toString();
      const url = `/api/dashboard/provider${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch provider dashboard data");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
