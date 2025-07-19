'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Users, LayoutDashboard, ShoppingCart, University, Shield} from 'lucide-react';
import {cn} from '@/lib/utils';

const navItems = [
  {href : '/dashboard', label : 'Início', icon : LayoutDashboard},
  {href : '/dashboard/dependants', label : 'Dependentes', icon : Users},
  {href : '/dashboard/affiliation', label : 'Minha Afiliação', icon : ShoppingCart},
  {href : '/dashboard/clubs', label : 'Explorar Clubes', icon : University},
  {href : '/dashboard/club-management', label : 'Gestão do Clube', icon : Shield},
];

export function DashboardNav() {
  const pathname = usePathname();

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