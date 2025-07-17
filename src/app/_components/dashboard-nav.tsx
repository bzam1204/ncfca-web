// src/app/_components/dashboard-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, ShoppingCart, University } from 'lucide-react'; // Importar o novo ícone

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/dashboard/dependants', label: 'Dependentes', icon: Users },
  { href: '/dashboard/affiliation', label: 'Minha Afiliação', icon: ShoppingCart },
  // ADICIONADO: Link para a nova seção de clubes.
  { href: '/dashboard/clubs', label: 'Clubes e Matrículas', icon: University },
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
                  pathname.startsWith(item.href) ? 'bg-accent' : 'transparent' // Use startsWith para sub-rotas
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