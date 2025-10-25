"use client"

import * as React from "react"
import {
  PieChart,
  Users,
  Shield,
  UserCheck,
  LucideIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useUserRole } from "@/hooks/use-user-role"
import { ToggleTheme } from "@/components/ui/toggle-theme"
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

    if (isClient) {
      const clientItems = [
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
      ];

      if (!isProvider) {
        clientItems.push({
          title: "Tornar-se um Prestador",
          url: "/tornar-prestador",
        });
      }

      baseItems.push(
        {
          title: "Cliente",
          url: "#",
          icon: Users,
          items: clientItems,
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
              url: "/meus-servicos",
            },
            {
              title: "Solicitações",
              url: "/solicitacoes",
            },
            {
              title: "Agenda",
              url: "/agenda",
            },
            {
              title: "Relatórios",
              url: "/relatorios",
            },
            {
              title: "Avaliações",
              url: "/avaliacoes",
            },
          ],
        }
      );
    }

    if (isAdmin) {
      baseItems.push(
        {
          title: "Administração",
          url: "#",
          icon: Shield,
          items: [
            {
              title: "Solicitações de Prestador",
              url: "/admin/solicitacoes-prestador",
            },
            {
              title: "Gerenciar Usuários",
              url: "/admin/gerenciar-usuarios",
            },
            {
              title: "Relatórios Completos",
              url: "/admin/relatorios-completos",
            },
          ],
        }
      );
    }

    return baseItems;
  };

  const data = {
    navMain: getNavMain(),
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">FlicApp</span>
          <div className="group-data-[collapsible=icon]:hidden">
            <ToggleTheme />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
