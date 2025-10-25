import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProviderWrapper } from "@/components/sidebar-provider-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { getUserRoles } from "@/lib/role-utils";
import { buildNavigation } from "@/lib/sidebar-utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userRoles = await getUserRoles(session.user.id);
  const isAdmin = userRoles.includes("ADMINISTRADOR");
  const isProvider = userRoles.includes("PRESTADOR");
  const isClient = userRoles.includes("CLIENTE");

  const navMain = buildNavigation(isClient, isProvider, isAdmin);

  return (
    <SidebarProviderWrapper>
      <AppSidebar navMain={navMain} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProviderWrapper>
  );
}
