"use client"

import {usePathname} from "next/navigation";

import {type LucideIcon} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {AppConfig} from "@/lib/config";

export function NavMain({items}: {
  items: {
    title: string
    icon: LucideIcon
    url: string
  }[]
}) {
  const path = usePathname();
  return (
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    className={'active:bg-gray-200 transition ' + (isHrefCurrentPath(item.url, path) ? 'bg-gray-950 text-white hover:bg-gray-700 hover:text-white active:bg-gray-400 active:text-white' : '')}
                    asChild>
                  <a href={item.url} className="font-medium">
                    <item.icon />
                    {item.title}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
  )
}

function isHrefCurrentPath(href: string, path: string) {
  const baseRoutes = AppConfig.navigation.baseRoutes;
  return path === href || (path.startsWith(href) && !baseRoutes.some(p => p === href));
}
