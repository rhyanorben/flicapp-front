/**
 * Utility functions for generating breadcrumbs from route paths
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isLast?: boolean;
}

/**
 * Maps route segments to readable labels
 */
const segmentLabels: Record<string, string> = {
  // Dashboard
  dashboard: "Home",

  // Cliente routes
  "solicitar-servico": "Solicitar Serviço",
  "meus-pedidos": "Meus Pedidos",
  historico: "Histórico",
  favoritos: "Favoritos",
  "tornar-prestador": "Tornar-se um Prestador",

  // Prestador routes
  "meus-servicos": "Meus Serviços",
  solicitacoes: "Solicitações",
  agenda: "Agenda",
  avaliacoes: "Avaliações",
  relatorios: "Relatórios",

  // Admin routes
  admin: "Administração",
  "gerenciar-usuarios": "Gerenciar Usuários",
  "solicitacoes-prestador": "Solicitações de Prestador",
  "relatorios-completos": "Relatórios Completos",
};

/**
 * Maps route group folders to section names
 */
const groupLabels: Record<string, string> = {
  "(cliente)": "Cliente",
  "(prestador)": "Prestador",
  "(admin)": "Administração",
};

/**
 * Generates breadcrumb items from a pathname
 * @param pathname - The current route pathname
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove leading slash and split into segments
  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Home", href: "/dashboard", isLast: true }];
  }

  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with FlicApp home
  breadcrumbs.push({
    label: "FlicApp",
    href: "/dashboard",
  });

  // Handle special case for dashboard root
  if (segments.length === 1 && segments[0] === "dashboard") {
    breadcrumbs.push({
      label: "Home",
      isLast: true,
    });
    return breadcrumbs;
  }

  // Process segments to build breadcrumbs
  let currentPath = "";
  let sectionAdded = false;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip route groups (folders with parentheses)
    if (segment.startsWith("(") && segment.endsWith(")")) {
      const groupName = groupLabels[segment];
      if (groupName && !sectionAdded) {
        breadcrumbs.push({
          label: groupName,
          href: currentPath,
        });
        sectionAdded = true;
      }
      continue;
    }

    // Get readable label for segment
    const label =
      segmentLabels[segment] ||
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Determine if this is the last item
    const isLast = i === segments.length - 1;

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      isLast,
    });
  }

  return breadcrumbs;
}
