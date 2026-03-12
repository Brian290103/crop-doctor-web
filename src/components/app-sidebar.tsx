"use client";

import {
  IconDatabase,
  IconFileWord,
  IconLayoutDashboard,
  IconMessageChatbot,
  IconPlant,
  IconReport,
  IconSeeding,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

const navItems = [
  {
    group: "Main",
    items: [
      {
        name: "Overview",
        url: "/dashboard",
        icon: IconLayoutDashboard,
        exact: true,
      },
      {
        name: "Sources",
        url: "/dashboard/sources",
        icon: IconSeeding,
        exact: false,
      },
    ],
  },
  {
    group: "Tools",
    items: [
      {
        name: "AI Chat",
        url: "/dashboard/chat",
        icon: IconMessageChatbot,
        exact: false,
      },
    ],
  },
];

const user = {
  name: "Admin",
  email: "admin@cropdoctor.app",
  avatar: "",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const isActive = (url: string, exact: boolean) => {
    if (exact) return pathname === url;
    return pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2 h-auto"
            >
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconPlant className="size-4" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-semibold text-sm">CropDoctor</span>
                  <span className="text-xs text-muted-foreground">Admin Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="pt-2">
        {navItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.url, item.exact);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        isActive={active}
                        className={cn(
                          "transition-colors",
                          active && "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary",
                        )}
                      >
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className={cn("size-4", active && "text-primary")} />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="pt-2">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
