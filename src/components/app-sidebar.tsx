"use client"

import * as React from "react"
import {
  PieChart,
  Settings2,
  Users,
  Shield,
  UserCheck,
  Calendar,
  BarChart3,
  FileText,
  MessageSquare,
  LucideIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { useUserRole } from "@/hooks/use-user-role"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userRoles, isAdmin, isProvider, isClient } = useUserRole();

  const getNavMain = () => {
    const baseItems: Array<{
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      items?: Array<{
        title: string;
        url: string;
      }>;
    }> = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: PieChart,
        isActive: true,
      },
    ];

    if (isAdmin) {
      baseItems.push(
        {
          title: "Administração",
          url: "#",
          icon: Shield,
          items: [
            {
              title: "Gerenciar Usuários",
              url: "#",
            },
            {
              title: "Configurações do Sistema",
              url: "#",
            },
            {
              title: "Relatórios Completos",
              url: "#",
            },
            {
              title: "Moderação",
              url: "#",
            },
          ],
        }
      );
    }

    if (isProvider) {
      baseItems.push(
        {
          title: "Prestador",
          url: "#",
          icon: UserCheck,
          items: [
            {
              title: "Meus Serviços",
              url: "#",
            },
            {
              title: "Solicitações",
              url: "#",
            },
            {
              title: "Agenda",
              url: "#",
            },
            {
              title: "Relatórios",
              url: "#",
            },
            {
              title: "Avaliações",
              url: "#",
            },
          ],
        }
      );
    }

    if (isClient) {
      baseItems.push(
        {
          title: "Cliente",
          url: "#",
          icon: Users,
          items: [
            {
              title: "Solicitar Serviço",
              url: "/solicitar-servico",
            },
            {
              title: "Meus Pedidos",
              url: "/meus-pedidos",
            },
            {
              title: "Histórico",
              url: "/historico",
            },
            {
              title: "Favoritos",
              url: "/favoritos",
            },
          ],
        }
      );
    }

    baseItems.push(
      {
        title: "Comunicação",
        url: "#",
        icon: MessageSquare,
        items: [
          {
            title: "Chat",
            url: "#",
          },
          {
            title: "Notificações",
            url: "#",
          },
        ],
      },
      {
        title: "Configurações",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Perfil",
            url: "#",
          },
          {
            title: "Preferências",
            url: "#",
          },
          {
            title: "Segurança",
            url: "#",
          },
        ],
      }
    );

    return baseItems;
  };

  const data = {
    navMain: getNavMain(),
    projects: [
      {
        name: "Atendimentos Recentes",
        url: "#",
        icon: Calendar,
      },
      {
        name: "Estatísticas",
        url: "#",
        icon: BarChart3,
      },
      {
        name: "Documentos",
        url: "#",
        icon: FileText,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
