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
import Image from "next/image";
import Link from "next/link";

// Icon mapping for string to component conversion
const iconMap: Record<string, LucideIcon> = {
  PieChart,
  Users,
  Shield,
  UserCheck,
};

export function AppSidebar({
  navMain,
  accordionState = {},
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
  accordionState?: Record<string, boolean>;
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
        <div className="flex items-center justify-between p-2">
          {/* <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            FlicAPP
          </span> */}
          <Link href="/dashboard">
            <Image
              src="/logo-flicapp-horizontal.png"
              alt="FlicAPP"
              className="group-data-[collapsible=icon]:hidden"
              width={170}
              height={40}
            />
          </Link>
          <div className="group-data-[collapsible=icon]:hidden">
            <ToggleTheme />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} initialOpenState={accordionState} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
