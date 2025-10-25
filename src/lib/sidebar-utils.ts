/**
 * Utilitários para gerenciar o estado do sidebar
 */

const SIDEBAR_COOKIE_NAME = "sidebar_state";

/**
 * Lê o estado do sidebar do cookie
 * @returns true se o sidebar deve estar aberto, false se deve estar fechado
 */
export function getSidebarStateFromCookie(): boolean {
  if (typeof document === "undefined") {
    return true; // Default no servidor
  }

  const cookies = document.cookie.split("; ");
  const sidebarCookie = cookies.find((cookie) =>
    cookie.startsWith(`${SIDEBAR_COOKIE_NAME}=`)
  );

  if (sidebarCookie) {
    const value = sidebarCookie.split("=")[1];
    return value === "true";
  }

  // Se não houver cookie, retorna true (aberto por padrão)
  return true;
}

/**
 * Constrói a estrutura de navegação do sidebar baseada nos roles do usuário
 */
export function buildNavigation(
  isClient: boolean,
  isProvider: boolean,
  isAdmin: boolean
): Array<{
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: Array<{
    title: string;
    url: string;
  }>;
}> {
  const baseItems: Array<{
    title: string;
    url: string;
    icon?: string;
    isActive?: boolean;
    items?: Array<{
      title: string;
      url: string;
    }>;
  }> = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "PieChart",
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

    baseItems.push({
      title: "Cliente",
      url: "#",
      icon: "Users",
      items: clientItems,
    });
  }

  if (isProvider) {
    baseItems.push({
      title: "Prestador",
      url: "#",
      icon: "UserCheck",
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
    });
  }

  if (isAdmin) {
    baseItems.push({
      title: "Administração",
      url: "#",
      icon: "Shield",
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
    });
  }

  return baseItems;
}
