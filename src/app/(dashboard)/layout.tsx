import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProviderWrapper } from "@/components/sidebar-provider-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProviderWrapper>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProviderWrapper>
  );
}
