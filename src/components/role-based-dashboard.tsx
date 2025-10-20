"use client";

import { useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { USER_ROLES, UserRole } from "@/types/user";
import { Shield, UserCheck, Users, Settings, BarChart3 } from "lucide-react";

export const RoleBasedDashboard = () => {
  const { 
    rolesDisplayNames, 
    isLoading, 
    userRoles,
    session,
    isAdmin,
    isProvider,
    isClient
  } = useUserRole();
  const [demoRole, setDemoRole] = useState<UserRole>(USER_ROLES.CLIENTE);
  
  const currentRoles = session?.user ? userRoles : [demoRole];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  console.log('currentRoles', currentRoles);

  const currentIsAdmin = session?.user ? isAdmin : demoRole === USER_ROLES.ADMINISTRADOR;
  const currentIsProvider = session?.user ? isProvider : demoRole === USER_ROLES.PRESTADOR;
  const currentIsClient = session?.user ? isClient : demoRole === USER_ROLES.CLIENTE;

  return (
    <div className="space-y-6">
      {/* Header com informações das roles */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao FlicApp! Suas funcionalidades baseadas nas suas roles.
          </p>
        </div>
        {!session?.user && (
          <div className="flex gap-2">
            <Button
              variant={demoRole === USER_ROLES.ADMINISTRADOR ? "default" : "outline"}
              onClick={() => setDemoRole(USER_ROLES.ADMINISTRADOR)}
              size="sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              Administrador
            </Button>
            <Button
              variant={demoRole === USER_ROLES.PRESTADOR ? "default" : "outline"}
              onClick={() => setDemoRole(USER_ROLES.PRESTADOR)}
              size="sm"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Prestador
            </Button>
            <Button
              variant={demoRole === USER_ROLES.CLIENTE ? "default" : "outline"}
              onClick={() => setDemoRole(USER_ROLES.CLIENTE)}
              size="sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Cliente
            </Button>
          </div>
        )}
      </div>

      {/* Cards de roles ativas */}
      {session?.user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Suas Roles Ativas
            </CardTitle>
            <CardDescription>
              Você possui acesso às seguintes funcionalidades:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {rolesDisplayNames.map((roleName, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium"
                >
                  {roleName}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Painel Administrativo */}
      {currentIsAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Painel Administrativo
            </CardTitle>
            <CardDescription>
              Funcionalidades exclusivas para administradores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Gestão de Usuários</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gerenciar usuários e roles</li>
                  <li>• Aprovar prestadores</li>
                  <li>• Moderação de conteúdo</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Sistema</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Configurações do sistema</li>
                  <li>• Relatórios completos</li>
                  <li>• Análise de métricas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Painel do Prestador */}
      {currentIsProvider && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Painel do Prestador
            </CardTitle>
            <CardDescription>
              Funcionalidades para prestadores de serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Serviços</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gerenciar serviços oferecidos</li>
                  <li>• Visualizar solicitações</li>
                  <li>• Configurar disponibilidade</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Relatórios</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Histórico de atendimentos</li>
                  <li>• Relatórios de prestação</li>
                  <li>• Avaliações recebidas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Painel do Cliente */}
      {currentIsClient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Painel do Cliente
            </CardTitle>
            <CardDescription>
              Funcionalidades para clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Serviços</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Solicitar serviços</li>
                  <li>• Acompanhar solicitações</li>
                  <li>• Favoritar prestadores</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Histórico</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Visualizar histórico</li>
                  <li>• Avaliar prestadores</li>
                  <li>• Gerenciar perfil</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funcionalidades Comuns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Funcionalidades Comuns
          </CardTitle>
          <CardDescription>
            Recursos disponíveis para todos os usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Perfil</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Visualizar perfil</li>
                <li>• Alterar configurações</li>
                <li>• Configurações de segurança</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Comunicação</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Chat com outros usuários</li>
                <li>• Notificações</li>
                <li>• Suporte técnico</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Atividades</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Histórico de atividades</li>
                <li>• Estatísticas pessoais</li>
                <li>• Documentos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};