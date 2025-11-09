"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface Appointment {
  id: string;
  clientId: string;
  providerId: string | null;
  addressId: string | null;
  categoryId: string | null;
  description: string;
  status: string;
  depositMethod: string;
  depositBaseAvgCents: number | null;
  depositCents: number;
  slotStart: string | null;
  slotEnd: string | null;
  finalPriceCents: number | null;
  reviewStatus: string | null;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    email: string | null;
    phoneE164: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  address?: {
    id: string;
    street: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    number: string | null;
    complement: string | null;
  };
  orderReview?: {
    rating: number | null;
    comment: string | null;
  };
}

async function fetchAppointments(
  period: string = "todos",
  status: string = "todos"
): Promise<Appointment[]> {
  const response = await fetch(
    `/api/provider/appointments?period=${period}&status=${status}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
}

export function useAppointments(
  period: string = "todos",
  status: string = "todos"
) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  return useQuery<Appointment[], Error>({
    queryKey: ["appointments", userId, period, status],
    queryFn: () => fetchAppointments(period, status),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  });
}
