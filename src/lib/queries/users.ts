"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getUsers,
  updateUserRoles,
  type UpdateUserRolesData,
} from "@/lib/api/users";

export function useUsers(roleFilter?: string) {
  return useQuery({
    queryKey: ["users", roleFilter],
    queryFn: () => getUsers(roleFilter),
  });
}

export function useUpdateUserRoles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserRolesData;
    }) => updateUserRoles(userId, data),
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
