export interface ServiceSelection {
  serviceType: string;
  experienceLevel: string;
  customService?: string;
}

export interface ProviderRequestData {
  services: ServiceSelection[];
  description: string;
  experience: string;
  phone: string;
  cep: string;
  address: string;
  documentNumber: string;
  portfolioLinks?: Array<{
    url: string;
    title: string;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ProviderRequest {
  id: string;
  userId: string;
  user: User;
  services: ServiceSelection[];
  description: string;
  experience: string;
  phone: string;
  address: string;
  documentNumber: string;
  portfolioLinks: string | null;
  status: string;
  rejectionReason?: string;
  reviewedBy: string | null;
  reviewedByUser: User | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderRequestResponse {
  message: string;
  request: ProviderRequest;
}

export async function submitProviderRequest(
  data: ProviderRequestData
): Promise<ProviderRequestResponse> {
  const response = await fetch("/api/provider-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao enviar solicitação");
  }

  return response.json();
}

export async function getProviderRequests(): Promise<ProviderRequest[]> {
  const response = await fetch("/api/provider-request/admin");

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Acesso negado");
    }
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar solicitações");
  }

  return response.json();
}

export async function getUserOwnProviderRequests(): Promise<ProviderRequest[]> {
  const response = await fetch("/api/provider-request");

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Não autenticado");
    }
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar solicitações");
  }

  return response.json();
}

export async function updateProviderRequest(
  id: string,
  action: "approve" | "reject",
  rejectionReason?: string
): Promise<{ message: string }> {
  const response = await fetch(`/api/provider-request/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, rejectionReason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao processar solicitação");
  }

  return response.json();
}
