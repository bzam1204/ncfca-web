'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Users, LayoutDashboard, ShoppingCart, University, Shield, GitFork} from 'lucide-react';
import {cn} from '@/lib/utils';
import {UserRoles} from "@/domain/enums/user.roles";
import {auth} from "@/lib/auth";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

const navItems = [
  {href : '/dashboard', label : 'Início', icon : LayoutDashboard, requiredRoles : []},
  {href : '/dashboard/dependants', label : 'Dependentes', icon : Users, requiredRoles : []},
  {
    href : '/dashboard/affiliation',
    label : 'Minha Afiliação',
    icon : ShoppingCart,
    requiredRoles : []
  },
  {href : '/dashboard/clubs', label : 'Explorar Clubes', icon : University, requiredRoles : []},
  {href : '/dashboard/club-management', label : 'Meu Clube', icon : Shield, requiredRoles : []},
  {href : '/admin/dashboard', label : 'Administração', icon : GitFork, requiredRoles : [UserRoles.ADMIN]},
];

export function DashboardNav() {
  const pathname: string = usePathname();
  const session = useSession();
  const userRoles: UserRoles[] = session.data?.user.roles as UserRoles[] ?? [];

  return (
      <nav className="grid items-start gap-2">
        {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                  className={cn(
                      'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      pathname.startsWith(item.href) ? 'bg-accent' : 'transparent'
                  )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </span>
            </Link>
        ))}
      </nav>
  );
}