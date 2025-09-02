"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  Sidebar,
} from "@/components/ui/sidebar"
import { AppConfig } from "@/infrastructure/config";

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="/dashboard">
            <div className="bg-transparent text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <svg width="20" height="125" viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
                aria-labelledby="svg-icon-title">
                <title id="svg-icon-title">Company Logo Icon</title>
                <g>
                  <rect x="0" y="0" width="49" height="49" fill="#009639" />
                  <rect x="51" y="0" width="49" height="49" fill="#FFCC00" />
                  <rect x="51" y="51" width="49" height="49" fill="#BDBDBD" />
                  <polygon points="0,51 49,51 49,100 24.5,125 0,100" fill="#0033A0" />
                </g>
              </svg>
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">NCFCA</span>
              <span className="">Clubes de Debate</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={AppConfig.navigation.user} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
} 
