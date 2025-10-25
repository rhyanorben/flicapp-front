"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { UsersFilters } from "./_components/users-filters";
import { UsersTable } from "./_components/users-table";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProviderWrapper } from "@/components/sidebar-provider-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserRole } from "@/app/generated/prisma";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  roles: UserRole[];
}

export default function GerenciarUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        filterUsers(data, currentFilter);
      } else if (response.status === 403) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsFetchingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const filterUsers = (allUsers: User[], filter: string) => {
    if (filter === "ALL") {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(allUsers.filter((user) => user.roles.includes(filter as UserRole)));
    }
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    filterUsers(users, filter);
  };

  const handleUserUpdate = () => {
    fetchUsers();
  };

  const getCounts = () => {
    return {
      all: users.length,
      clients: users.filter((u) => u.roles.includes("CLIENTE")).length,
      providers: users.filter((u) => u.roles.includes("PRESTADOR")).length,
      admins: users.filter((u) => u.roles.includes("ADMINISTRADOR")).length,
    };
  };

  if (isFetchingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProviderWrapper>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    FlicApp
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">
                    Administração
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Gerenciar Usuários</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
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
              <UsersTable
                users={filteredUsers}
                onUserUpdate={handleUserUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProviderWrapper>
  );
}

