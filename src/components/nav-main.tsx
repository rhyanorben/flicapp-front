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

const SIDEBAR_STATE_KEY = "flicapp_sidebar_state";

export function NavMain({
  items,
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
}) {
  const { isMobile, setOpenMobile, setOpen } = useSidebar();

  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    // Always use the same initial state for server and client to prevent hydration issues
    return items.reduce((acc, item) => {
      if (item.items && item.items.length > 0) {
        acc[item.title] = item.isActive || false;
      }
      return acc;
    }, {} as Record<string, boolean>);
  });

  // Load from localStorage after hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
        if (stored) {
          const parsedState = JSON.parse(stored);
          setOpenItems(parsedState);
        }
      } catch (error) {
        console.error("Erro ao carregar estado do sidebar:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(openItems));
      } catch (error) {
        console.error("Erro ao salvar estado do sidebar:", error);
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
    } else {
      setOpen(false);
    }
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
