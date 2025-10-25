"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { UserRole } from "@/app/generated/prisma";
import { UserDetailsDialog } from "./user-details-dialog";
import {
  ModernTable,
  ModernTableRow,
  ModernTableHeader,
  ModernTableCell,
} from "@/components/ui/modern-table";
import { RowActions, ActionIcons } from "@/components/ui/row-actions";
import {
  TableControls,
  SearchInput,
  SortOption,
  FilterOption,
} from "@/components/ui/table-controls";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  exportToCSV,
  exportToJSON,
  formatDate,
  sortByString,
  sortByDate,
  paginateData,
} from "@/lib/utils/table-utils";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const ITEMS_PER_PAGE = 10;

  // Sort and filter options
  const sortOptions: SortOption[] = [
    { value: "name", label: "Nome", icon: <User className="h-3 w-3" /> },
    { value: "email", label: "Email", icon: <Mail className="h-3 w-3" /> },
    {
      value: "createdAt",
      label: "Data de Cadastro",
      icon: <Calendar className="h-3 w-3" />,
    },
    { value: "roles", label: "Roles", icon: <Shield className="h-3 w-3" /> },
  ];

  const filterOptions: FilterOption[] = [
    { value: "todos", label: "Todos os roles" },
    { value: "ADMINISTRADOR", label: "Administrador" },
    { value: "PRESTADOR", label: "Prestador" },
    { value: "CLIENTE", label: "Cliente" },
  ];

  const getRoleBadges = (roles: UserRole[]) => {
    return roles.map((role) => {
      const variant: "default" | "secondary" | "outline" = "outline";
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

  // Filter and sort logic
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "todos" || user.roles.includes(roleFilter as UserRole);

      return matchesSearch && matchesRole;
    });

    if (sortField) {
      if (sortField === "createdAt") {
        filtered = sortByDate(filtered, sortField as keyof User, sortOrder);
      } else if (sortField === "roles") {
        filtered = filtered.sort((a, b) => {
          const aRoles = a.roles.length;
          const bRoles = b.roles.length;
          if (aRoles < bRoles) return sortOrder === "asc" ? -1 : 1;
          if (aRoles > bRoles) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      } else {
        filtered = sortByString(filtered, sortField as keyof User, sortOrder);
      }
    }

    return filtered;
  }, [users, searchTerm, roleFilter, sortField, sortOrder]);

  const { paginatedData, totalPages, totalItems } = paginateData(
    filteredAndSortedUsers,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleSortChange = (value: string) => {
    if (sortField === value) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(value);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedData.map((user) => user.id));
    }
  };

  const handleExportCSV = () => {
    const headers = {
      id: "ID",
      name: "Nome",
      email: "Email",
      image: "Imagem",
      roles: "Roles",
      createdAt: "Data de Cadastro",
    };
    exportToCSV(filteredAndSortedUsers, "usuarios", headers);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredAndSortedUsers, "usuarios");
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
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nome ou email..."
        />
        <TableControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOptions={sortOptions}
          currentSort={sortField}
          onSortChange={handleSortChange}
          filterOptions={filterOptions}
          currentFilter={roleFilter}
          onFilterChange={handleFilterChange}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
        />
      </div>

      <ModernTable useGridLayout={true} gridColumns="40px 1fr 1fr 1fr 1fr 40px">
        <ModernTableHeader gridColumns="40px 1fr 1fr 1fr 1fr 40px">
          <div className="flex items-center justify-center border-r border-border/20 pr-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border/40 cursor-pointer"
              checked={
                paginatedData.length > 0 &&
                selectedUsers.length === paginatedData.length
              }
              onChange={handleSelectAll}
            />
          </div>
          <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
            <User className="h-3 w-3" />
            <span>Nome</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
            <Mail className="h-3 w-3" />
            <span>Email</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
            <Shield className="h-3 w-3" />
            <span>Roles</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
            <Calendar className="h-3 w-3" />
            <span>Data de Cadastro</span>
          </div>
          <div className="flex items-center justify-center px-3">
            <span className="text-xs">⚙️</span>
          </div>
        </ModernTableHeader>

        {paginatedData.map((user) => (
          <ModernTableRow
            key={user.id}
            isSelected={selectedUsers.includes(user.id)}
            onClick={() => handleViewUser(user)}
            gridColumns="40px 1fr 1fr 1fr 1fr 40px"
          >
            <ModernTableCell borderRight={true}>
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border/40 cursor-pointer"
                checked={selectedUsers.includes(user.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectUser(user.id);
                }}
              />
            </ModernTableCell>
            <ModernTableCell borderRight={true}>
              <span className="font-medium text-foreground">{user.name}</span>
            </ModernTableCell>
            <ModernTableCell borderRight={true}>
              <span className="text-foreground">{user.email}</span>
            </ModernTableCell>
            <ModernTableCell borderRight={true}>
              <div className="flex gap-1 flex-wrap">
                {getRoleBadges(user.roles)}
              </div>
            </ModernTableCell>
            <ModernTableCell borderRight={true}>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-foreground">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </ModernTableCell>
            <ModernTableCell>
              <RowActions
                actions={[
                  {
                    id: "view",
                    label: "Ver Detalhes",
                    icon: ActionIcons.View,
                    onClick: () => handleViewUser(user),
                  },
                ]}
              />
            </ModernTableCell>
          </ModernTableRow>
        ))}
      </ModernTable>

      {paginatedData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum usuário encontrado com os filtros aplicados.
        </div>
      )}

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
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
