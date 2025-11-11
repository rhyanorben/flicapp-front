"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsersTable } from "./_components/users-table";
import { useUsers } from "@/lib/queries/users";

function GerenciarUsuariosTable() {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState<string>("todos");
  const { data: users, isLoading, error, refetch } = useUsers(roleFilter);

  // Handle 403 redirect
  if (error?.message === "Acesso negado") {
    router.push("/dashboard");
  }

  const handleUserUpdate = () => {
    refetch();
  };

  const handleFilterChange = (filter: string) => {
    setRoleFilter(filter);
  };

  if (isLoading) {
    return <GerenciarUsuariosTableSkeleton />;
  }

  return (
    <UsersTable
      users={users || []}
      onUserUpdate={handleUserUpdate}
      onFilterChange={handleFilterChange}
    />
  );
}

function GerenciarUsuariosTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-muted animate-pulse rounded" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 w-full bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}

export default function GerenciarUsuariosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie os usuários do sistema e suas roles
        </p>
      </div>
      <GerenciarUsuariosTable />
    </div>
  );
}
