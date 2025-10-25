"use client";

import * as React from "react";
import { PieChart, Users, Shield, UserCheck, LucideIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { ToggleTheme } from "@/components/ui/toggle-theme";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Icon mapping for string to component conversion
const iconMap: Record<string, LucideIcon> = {
  PieChart,
  Users,
  Shield,
  UserCheck,
};

export function AppSidebar({
  navMain,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navMain: Array<{
    title: string;
    url: string;
    icon?: string;
    isActive?: boolean;
    items?: Array<{
      title: string;
      url: string;
    }>;
  }>;
}) {
  // Convert icon strings to actual icon components
  const processedNavMain = navMain.map((item) => ({
    ...item,
    icon: item.icon ? iconMap[item.icon] : undefined,
  }));

  const data = {
    navMain: processedNavMain,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            FlicAPP
          </span>
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
  );
}
