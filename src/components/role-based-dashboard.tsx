"use client";

import { useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { USER_ROLES, UserRole } from "@/types/user";

export const RoleBasedDashboard = () => {
  const { roleDisplayName, isLoading, userRole, session } = useUserRole();
  const [demoRole, setDemoRole] = useState<UserRole>(USER_ROLES.CLIENTE);
  
  const currentRole = session?.user ? userRole : demoRole;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  const isAdmin = currentRole === USER_ROLES.ADMINISTRADOR;
  const isProvider = currentRole === USER_ROLES.PRESTADOR;
  const isClient = currentRole === USER_ROLES.CLIENTE;

  return (
    <div className="space-y-6">
      {/* Informações da Role */}
      <Card>
        <CardHeader>
          <CardTitle>
            {session?.user ? "Role do Usuário Logado" : "Demonstração das Roles"}
          </CardTitle>
          <CardDescription>
            {session?.user 
              ? "Role atual baseada no usuário logado" 
              : "Selecione uma role para ver o conteúdo específico do dashboard"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!session?.user && (
            <div className="flex gap-2 flex-wrap mb-4">
              <Button
                variant={demoRole === USER_ROLES.ADMINISTRADOR ? "default" : "outline"}
                onClick={() => setDemoRole(USER_ROLES.ADMINISTRADOR)}
              >
                Administrador
              </Button>
              <Button
                variant={demoRole === USER_ROLES.PRESTADOR ? "default" : "outline"}
                onClick={() => setDemoRole(USER_ROLES.PRESTADOR)}
              >
                Prestador
              </Button>
              <Button
                variant={demoRole === USER_ROLES.CLIENTE ? "default" : "outline"}
                onClick={() => setDemoRole(USER_ROLES.CLIENTE)}
              >
                Cliente
              </Button>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            Role atual: <span className="font-semibold">{roleDisplayName}</span>
            {session?.user && (
              <span className="ml-2 text-green-600">(Dados reais da sessão)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo específico para Administrador */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Painel Administrativo</CardTitle>
            <CardDescription>
              Funcionalidades exclusivas para administradores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>• Gerenciar usuários</p>
              <p>• Configurações do sistema</p>
              <p>• Relatórios completos</p>
              <p>• Acesso total ao sistema</p>
              <p>• Moderação de conteúdo</p>
              <p>• Análise de métricas</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo específico para Prestador */}
      {isProvider && (
        <Card>
          <CardHeader>
            <CardTitle>Painel do Prestador</CardTitle>
            <CardDescription>
              Funcionalidades para prestadores de serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>• Gerenciar serviços oferecidos</p>
              <p>• Visualizar solicitações</p>
              <p>• Relatórios de prestação</p>
              <p>• Histórico de atendimentos</p>
              <p>• Configurar disponibilidade</p>
              <p>• Avaliações recebidas</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo específico para Cliente */}
      {isClient && (
        <Card>
          <CardHeader>
            <CardTitle>Painel do Cliente</CardTitle>
            <CardDescription>
              Funcionalidades para clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>• Solicitar serviços</p>
              <p>• Visualizar histórico</p>
              <p>• Avaliar prestadores</p>
              <p>• Gerenciar perfil</p>
              <p>• Acompanhar solicitações</p>
              <p>• Favoritar prestadores</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo comum para todos */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades Comuns</CardTitle>
          <CardDescription>
            Recursos disponíveis para todos os usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>• Visualizar perfil</p>
            <p>• Alterar configurações</p>
            <p>• Suporte técnico</p>
            <p>• Notificações</p>
            <p>• Chat com outros usuários</p>
            <p>• Histórico de atividades</p>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre a implementação */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
          <CardDescription>
            Como as roles foram implementadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Banco de dados:</strong> Campo `role` adicionado ao modelo User com enum UserRole</p>
            <p><strong>Valores possíveis:</strong> ADMINISTRADOR, PRESTADOR, CLIENTE</p>
            <p><strong>Padrão:</strong> CLIENTE (para novos usuários)</p>
            <p><strong>Migração:</strong> Aplicada automaticamente via Prisma</p>
            <p><strong>Tipos:</strong> TypeScript com helpers para verificação de roles</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};