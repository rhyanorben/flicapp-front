"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_ACCORDION_COOKIE_NAME = "nav_accordion_state";
const NAV_ACCORDION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function NavMain({
  items,
  initialOpenState = {},
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  initialOpenState?: Record<string, boolean>;
}) {
  const { isMobile, setOpenMobile, setOpen } = useSidebar();

  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    // Use the initial state passed from server (from cookie) or fallback to isActive
    return items.reduce((acc, item) => {
      if (item.items && item.items.length > 0) {
        acc[item.title] =
          initialOpenState[item.title] ?? item.isActive ?? false;
      }
      return acc;
    }, {} as Record<string, boolean>);
  });

  // Update cookie when accordion state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        document.cookie = `${NAV_ACCORDION_COOKIE_NAME}=${JSON.stringify(
          openItems
        )}; path=/; max-age=${NAV_ACCORDION_COOKIE_MAX_AGE}`;
      } catch (error) {
        console.error("Erro ao salvar estado do accordion:", error);
      }
    }
  }, [openItems]);

  const handleOpenChange = (title: string, isOpen: boolean) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: isOpen,
    }));
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    // Desktop: sidebar permanece aberto
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <a href={item.url} onClick={handleLinkClick}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              open={openItems[item.title] ?? item.isActive ?? false}
              onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url} onClick={handleLinkClick}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
