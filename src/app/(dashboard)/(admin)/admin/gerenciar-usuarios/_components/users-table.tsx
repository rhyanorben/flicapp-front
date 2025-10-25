"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { UserRole } from "@/app/generated/prisma";
import { UserDetailsDialog } from "./user-details-dialog";

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
      let variant: "default" | "secondary" | "outline" = "outline";
      let className = "";

      switch (role) {
        case "ADMINISTRADOR":
          className = "bg-red-100 text-red-800 border-red-300";
          break;
        case "PRESTADOR":
          className = "bg-blue-100 text-blue-800 border-blue-300";
          break;
        case "CLIENTE":
          className = "bg-green-100 text-green-800 border-green-300";
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

  if (users.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Nenhum usuário encontrado
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {getRoleBadges(user.roles)}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewUser(user)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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

