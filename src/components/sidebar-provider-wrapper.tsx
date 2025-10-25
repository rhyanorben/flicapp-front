"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarStateFromCookie } from "@/lib/sidebar-utils";
import { ReactNode } from "react";

/**
 * Wrapper para SidebarProvider que lê o estado inicial do cookie
 * Isso garante que o sidebar mantenha seu estado entre navegações
 */
export function SidebarProviderWrapper({ children }: { children: ReactNode }) {
  const defaultOpen = getSidebarStateFromCookie();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
  );
}
