"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { convertPhoneToE164 } from "@/lib/utils/phone-mask";
import type {
  ProfileData,
  AddressData,
  CreateAddressData,
  UpdateProfileData,
  UpdateAddressData,
} from "@/types/profile";

// API functions
async function fetchProfile(userId: string): Promise<ProfileData> {
  const response = await fetch(`/api/user/${userId}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do perfil");
  }
  return response.json();
}

async function fetchAddresses(userId: string): Promise<AddressData[]> {
  const response = await fetch(`/api/user/${userId}/addresses`);
  if (!response.ok) {
    throw new Error("Erro ao buscar endereços");
  }
  return response.json();
}

async function updateProfile(
  userId: string,
  data: UpdateProfileData
): Promise<ProfileData> {
  const response = await fetch(`/api/user/${userId}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar perfil");
  }

  return response.json();
}

async function createAddress(
  userId: string,
  data: CreateAddressData
): Promise<AddressData> {
  const response = await fetch(`/api/user/${userId}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao criar endereço");
  }

  return response.json();
}

async function updateAddress(
  userId: string,
  addressId: string,
  data: UpdateAddressData
): Promise<AddressData> {
  const response = await fetch(`/api/user/${userId}/addresses/${addressId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar endereço");
  }

  return response.json();
}

async function deleteAddress(userId: string, addressId: string): Promise<void> {
  const response = await fetch(`/api/user/${userId}/addresses/${addressId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao remover endereço");
  }
}

async function toggleAddressActive(
  userId: string,
  addressId: string
): Promise<AddressData> {
  const response = await fetch(
    `/api/user/${userId}/addresses/${addressId}/toggle`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao alterar status do endereço");
  }

  return response.json();
}

// Hook for profile data
export function useProfile() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });
}

// Hook for addresses
export function useAddresses() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => fetchAddresses(userId!),
    enabled: !!userId,
  });
}

// Hook for profile mutations
export function useProfileMutations() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (
      data: Omit<UpdateProfileData, "phoneE164"> & { phone: string }
    ) => {
      if (!userId) throw new Error("Usuário não autenticado");

      const phoneE164 = convertPhoneToE164(data.phone);
      return updateProfile(userId, {
        name: data.name,
        phoneE164,
        cpf: data.cpf && data.cpf.trim() !== "" ? data.cpf : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: (data: CreateAddressData) => {
      if (!userId) throw new Error("Usuário não autenticado");
      return createAddress(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: string;
      data: UpdateAddressData;
    }) => {
      if (!userId) throw new Error("Usuário não autenticado");
      return updateAddress(userId, addressId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) => {
      if (!userId) throw new Error("Usuário não autenticado");
      return deleteAddress(userId, addressId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });

  const toggleAddressActiveMutation = useMutation({
    mutationFn: (addressId: string) => {
      if (!userId) throw new Error("Usuário não autenticado");
      return toggleAddressActive(userId, addressId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });

  return {
    updateProfile: updateProfileMutation,
    createAddress: createAddressMutation,
    updateAddress: updateAddressMutation,
    deleteAddress: deleteAddressMutation,
    toggleAddressActive: toggleAddressActiveMutation,
  };
}
