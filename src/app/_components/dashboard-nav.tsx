// src/app/_components/dashboard-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Users, LayoutDashboard, ShoppingCart, University, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import {UserRoles} from "@/domain/enums/user.roles";

const navItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard, requiredRole: null },
  { href: '/dashboard/dependants', label: 'Dependentes', icon: Users, requiredRole: null },
  { href: '/dashboard/affiliation', label: 'Minha Afiliação', icon: ShoppingCart, requiredRole: null },
  { href: '/dashboard/clubs', label: 'Explorar Clubes', icon: University, requiredRole: null },
  { href: '/dashboard/club-management', label: 'Gestão do Clube', icon: Shield, requiredRole: UserRoles.DONO_DE_CLUBE },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];

  return (
      <nav className="grid items-start gap-2">
        {navItems.map((item) => {
          if (item.requiredRole && !userRoles.includes(item.requiredRole)) {
            return null;
          }

          return (
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
          );
        })}
      </nav>
  );
}
