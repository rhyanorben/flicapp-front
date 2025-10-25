import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeaderWrapper from "@/components/dashboard-header-wrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { getUserRoles } from "@/lib/role-utils";
import { buildNavigation } from "@/lib/sidebar-utils";
import { cookies, headers } from "next/headers";
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

  // Read sidebar state from cookie on server side
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  // Read accordion state from cookie on server side
  const accordionStateCookie = cookieStore.get("nav_accordion_state")?.value;
  const accordionState = accordionStateCookie
    ? JSON.parse(accordionStateCookie)
    : {};

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar navMain={navMain} accordionState={accordionState} />
      <SidebarInset>
        <DashboardHeaderWrapper />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
