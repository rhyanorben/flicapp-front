"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield, Eye } from "lucide-react";
import { UserRole } from "@/app/generated/prisma";
import { UserDetailsDialog } from "./user-details-dialog";
import {
  GenericTable,
  TableColumn,
  TableAction,
} from "@/components/ui/generic-table";
import { DetailModalSection } from "@/components/ui/detail-modal";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  roles: UserRole[];
}

interface UsersTableProps {
  users: User[];
  onUserUpdate: () => void;
}

export function UsersTable({ users, onUserUpdate }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRoleBadges = (roles: UserRole[]) => {
    return roles.map((role) => {
      const variant: "default" | "secondary" | "outline" = "outline";
      let className = "";

      switch (role) {
        case "ADMINISTRADOR":
          className =
            "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800";
          break;
        case "PRESTADOR":
          className =
            "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800";
          break;
        case "CLIENTE":
          className =
            "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800";
          break;
      }

      return (
        <Badge key={role} variant={variant} className={className}>
          {role === "ADMINISTRADOR" && "Admin"}
          {role === "PRESTADOR" && "Prestador"}
          {role === "CLIENTE" && "Cliente"}
        </Badge>
      );
    });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  // Configuração das colunas
  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: "name",
        label: "Nome",
        sortable: true,
        render: (value: unknown, row: Record<string, unknown>) => {
          const user = row as unknown as User;
          return (
            <div className="space-y-1">
              <p className="font-medium">{user.name}</p>
            </div>
          );
        },
      },
      {
        key: "email",
        label: "Email",
        sortable: true,
        render: (value: unknown, row: Record<string, unknown>) => {
          const user = row as unknown as User;
          return (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          );
        },
      },
      {
        key: "roles",
        label: "Roles",
        render: (value: unknown, row: Record<string, unknown>) => {
          const user = row as unknown as User;
          return (
            <div className="flex gap-1 flex-wrap">
              {getRoleBadges(user.roles)}
            </div>
          );
        },
      },
      {
        key: "createdAt",
        label: "Data de Cadastro",
        sortable: true,
        render: (value: unknown, row: Record<string, unknown>) => {
          const user = row as unknown as User;
          return (
            <div className="text-sm">
              {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              <p className="text-xs text-muted-foreground">
                {new Date(user.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        },
      },
    ],
    []
  );

  // Ações customizadas
  const customActions: TableAction[] = useMemo(
    () => [
      {
        id: "view",
        label: "Ver Detalhes",
        icon: ({ className }) => <Eye className={className} />,
        onClick: (row: Record<string, unknown>) => {
          const user = row as unknown as User;
          handleViewUser(user);
        },
        variant: "default",
      },
    ],
    []
  );

  // Conteúdo do modal de detalhes
  const detailModalContent = (user: User) => (
    <>
      <DetailModalSection
        title="ID do Usuário"
        icon={<User className="h-3 w-3" />}
      >
        {user.id}
      </DetailModalSection>

      <DetailModalSection title="Nome" icon={<User className="h-3 w-3" />}>
        {user.name}
      </DetailModalSection>

      <DetailModalSection title="Email" icon={<Mail className="h-3 w-3" />}>
        {user.email}
      </DetailModalSection>

      <DetailModalSection title="Roles" icon={<Shield className="h-3 w-3" />}>
        <div className="flex gap-1 flex-wrap">{getRoleBadges(user.roles)}</div>
      </DetailModalSection>

      <DetailModalSection
        title="Data de Cadastro"
        icon={<Calendar className="h-3 w-3" />}
      >
        {new Date(user.createdAt).toLocaleString("pt-BR")}
      </DetailModalSection>
    </>
  );

  return (
    <>
      <GenericTable
        data={users as unknown as Record<string, unknown>[]}
        columns={columns}
        actions={customActions}
        searchPlaceholder="Buscar por nome ou email..."
        sortOptions={[
          { value: "name", label: "Nome" },
          { value: "email", label: "Email" },
          { value: "createdAt", label: "Data de Cadastro" },
        ]}
        filterOptions={[
          { value: "todos", label: "Todos os roles" },
          { value: "ADMINISTRADOR", label: "Administrador" },
          { value: "PRESTADOR", label: "Prestador" },
          { value: "CLIENTE", label: "Cliente" },
        ]}
        onRowClick={(row) => {
          const user = row as unknown as User;
          handleViewUser(user);
        }}
        detailModalContent={(row) => detailModalContent(row as unknown as User)}
      />

      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onUpdate={onUserUpdate}
        />
      )}
    </>
  );
}
