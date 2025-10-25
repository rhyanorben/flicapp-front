"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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
import Link from "next/link";

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
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

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

  // Function to check if an item is active
  const isItemActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url) && url !== "/dashboard";
  };

  // Function to check if a parent item should be open (has active children)
  const shouldParentBeOpen = (items: { title: string; url: string }[]) => {
    return items.some((subItem) => isItemActive(subItem.url));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items || item.items.length === 0) {
            const isActive = isItemActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                  className={
                    isActive
                      ? "data-[active=true]:border-l-4 data-[active=true]:border-blue-400"
                      : ""
                  }
                >
                  <Link href={item.url} onClick={handleLinkClick}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          const hasActiveChild = shouldParentBeOpen(item.items || []);
          const shouldBeOpen = openItems[item.title] ?? hasActiveChild;

          return (
            <Collapsible
              key={item.title}
              asChild
              open={shouldBeOpen}
              onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={hasActiveChild}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive = isItemActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubItemActive}
                          >
                            <Link href={subItem.url} onClick={handleLinkClick}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
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
