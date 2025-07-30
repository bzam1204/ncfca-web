"use client"

import {usePathname} from "next/navigation";

import {type LucideIcon} from "lucide-react";

import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {AppConfig} from "@/infraestructure/config";
import {UserRoles} from "@/domain/enums/user.roles";
import {useSession} from "next-auth/react";
import {useRef} from "react";

export function NavMain(props: NavMainProps) {
  const path = usePathname();
  return (
      <SidebarGroup>
        <SidebarMenu>
          {props.items.map((item) => <NavItem {...item} path={path} key={item.title} />)}
        </SidebarMenu>
      </SidebarGroup>
  )
}

interface NavItemProps {
  requiredRoles?: UserRoles[];
  title: string;
  path: string;
  Icon: LucideIcon;
  url: string;
}

function NavItem(input: NavItemProps) {
  const {title, Icon, url, path} = input;
  const hasBeenRendered = useRef<boolean>(false);
  const session = useSession();
  const element = (
      <SidebarMenuItem>
        {hasBeenRendered.current ? null : hasBeenRendered.current = true}
        <SidebarMenuButton
            className={'active:bg-gray-200 transition ' + (isHrefCurrentPath(url, path) ? 'bg-gray-950 text-white hover:bg-gray-700 hover:text-white active:bg-gray-400 active:text-white' : '')}
            asChild>
          <a href={url} className="font-medium">
            <Icon />
            {title}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
  );
  if (hasBeenRendered.current) return element;
  if (!input.requiredRoles) return element;
  if (session.status !== 'authenticated') return null;
  if (!userCanAccess(session.data.user.roles, input.requiredRoles)) return null;
  return element;
}

function isHrefCurrentPath(href: string, path: string) {
  const baseRoutes = AppConfig.navigation.baseRoutes;
  return path === href || (path.startsWith(href) && !baseRoutes.some(p => p === href));
}

function userCanAccess(userRoles: UserRoles[], requiredRoles: UserRoles[] | undefined): boolean {
  return !requiredRoles || requiredRoles.length === 0 || userRoles.some(role => requiredRoles!.includes(role));
}

interface NavMainProps {
  items: {
    requiredRoles?: UserRoles[];
    title: string
    Icon: LucideIcon
    url: string
  }[]
}
