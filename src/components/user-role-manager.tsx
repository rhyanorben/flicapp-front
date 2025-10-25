"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole, USER_ROLES, getRoleDisplayName } from "@/types/user";

interface UserRoleManagerProps {
  userId: string;
  currentRoles: UserRole[];
  onRolesChange?: (newRoles: UserRole[]) => void;
}

export const UserRoleManager = ({
  userId,
  currentRoles,
  onRolesChange,
}: UserRoleManagerProps) => {
  const [roles, setRoles] = useState<UserRole[]>(currentRoles);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRoles(currentRoles);
  }, [currentRoles]);

  const handleRoleToggle = async (roleName: UserRole) => {
    setIsLoading(true);
    try {
      const action = roles.includes(roleName) ? "remove" : "assign";

      const response = await fetch(`/api/user/${userId}/roles/manage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleName,
          action,
        }),
      });

      if (response.ok) {
        const newRoles = roles.includes(roleName)
          ? roles.filter((role) => role !== roleName)
          : [...roles, roleName];

        setRoles(newRoles);
        onRolesChange?.(newRoles);
      } else {
        console.error("Erro ao atualizar role");
      }
    } catch (error) {
      console.error("Erro ao atualizar role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Roles</CardTitle>
        <CardDescription>Atribuir ou remover roles do usuário</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.values(USER_ROLES).map((roleName) => {
            const isAssigned = roles.includes(roleName);
            return (
              <div
                key={roleName}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isAssigned ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="font-medium">
                    {getRoleDisplayName(roleName)}
                  </span>
                </div>
                <Button
                  variant={isAssigned ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleRoleToggle(roleName)}
                  disabled={isLoading}
                >
                  {isAssigned ? "Remover" : "Atribuir"}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <strong>Roles atuais:</strong>
            <div className="flex gap-2 flex-wrap mt-1">
              {roles.map((role, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-semibold"
                >
                  {getRoleDisplayName(role)}
                </span>
              ))}
              {roles.length === 0 && (
                <span className="text-gray-500 text-xs">
                  Nenhuma role atribuída
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
