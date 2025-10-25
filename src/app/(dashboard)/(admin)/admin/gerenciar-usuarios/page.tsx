"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { UsersFilters } from "./_components/users-filters";
import { UsersTable } from "./_components/users-table";
import { UserRole } from "@/app/generated/prisma";
import { useUsers } from "@/lib/queries/users";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  roles: UserRole[];
}

export default function GerenciarUsuariosPage() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const router = useRouter();
  const { data: users, isLoading, error, refetch } = useUsers();

  // Handle 403 redirect
  if (error?.message === "Acesso negado") {
    router.push("/dashboard");
  }

  const filterUsers = (allUsers: User[], filter: string) => {
    if (filter === "ALL") {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(
        allUsers.filter((user) => user.roles.includes(filter as UserRole))
      );
    }
  };

  // Update filtered users when users data changes
  useEffect(() => {
    if (users) {
      filterUsers(users, currentFilter);
    }
  }, [users, currentFilter]);

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    if (users) {
      filterUsers(users, filter);
    }
  };

  const handleUserUpdate = () => {
    refetch();
  };

  const getCounts = () => {
    if (!users) return { all: 0, clients: 0, providers: 0, admins: 0 };
    return {
      all: users.length,
      clients: users.filter((u) => u.roles.includes("CLIENTE")).length,
      providers: users.filter((u) => u.roles.includes("PRESTADOR")).length,
      admins: users.filter((u) => u.roles.includes("ADMINISTRADOR")).length,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gerenciar Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie os usuários do sistema e suas roles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UsersFilters
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            counts={getCounts()}
          />
          <UsersTable users={filteredUsers} onUserUpdate={handleUserUpdate} />
        </CardContent>
      </Card>
    </div>
  );
}
