// src/app/(admin)/_components/admin-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Shield, CreditCard, BarChart3 } from 'lucide-react';
import { cn } from '@/infrastructure/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Visão Geral', icon: BarChart3 },
  { href: '/admin/dashboard/users', label: 'Usuários', icon: Users },
  { href: '/admin/dashboard/clubs', label: 'Clubes', icon: Shield },
  { href: '/admin/dashboard/affiliations', label: 'Afiliações', icon: CreditCard },
  // Futuramente: { href: '/admin/dashboard/roles', label: 'Perfis', icon: KeyRound },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <span
            className={cn(
              'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === item.href ? 'bg-accent' : 'transparent',
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
