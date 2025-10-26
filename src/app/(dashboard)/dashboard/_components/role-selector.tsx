"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserRole, getRoleDisplayName } from "@/types/user";
import { Users, UserCheck, Shield } from "lucide-react";

interface RoleSelectorProps {
  userRoles: UserRole[];
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ROLE_ICONS = {
  CLIENTE: Users,
  PRESTADOR: UserCheck,
  ADMINISTRADOR: Shield,
};

const ROLE_COLORS = {
  CLIENTE: "bg-blue-100 text-blue-800 border-blue-300",
  PRESTADOR: "bg-green-100 text-green-800 border-green-300",
  ADMINISTRADOR: "bg-purple-100 text-purple-800 border-purple-300",
};

export function RoleSelector({
  userRoles,
  selectedRole,
  onRoleChange,
}: RoleSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar seletor apenas se usuário tem múltiplas roles
    setIsVisible(userRoles.length > 1);
  }, [userRoles]);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Visualizar como:
            </span>
            <Badge variant="outline" className="text-xs">
              {userRoles.length} {userRoles.length === 1 ? "role" : "roles"}
            </Badge>
          </div>

          <Tabs value={selectedRole} onValueChange={onRoleChange}>
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              {userRoles.map((role) => {
                const Icon = ROLE_ICONS[role];
                return (
                  <TabsTrigger
                    key={role}
                    value={role}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {getRoleDisplayName(role)}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {userRoles.map((role) => {
            const Icon = ROLE_ICONS[role];
            const isActive = selectedRole === role;
            return (
              <div
                key={role}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                  isActive
                    ? ROLE_COLORS[role]
                    : "bg-muted text-muted-foreground border-muted"
                }`}
              >
                <Icon className="h-3 w-3" />
                {getRoleDisplayName(role)}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
