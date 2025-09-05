import { Baby, CreditCard, HomeIcon, LayoutGrid, PlayCircle, School, Shield, ShieldUser, Trophy, UserSearch } from 'lucide-react';

import { UserRoles } from '@/domain/enums/user.roles';

export const navigation = {
  user: [
    {
      title: 'Início',
      url: '/dashboard',
      Icon: LayoutGrid,
    },

    {
      title: 'Meus Dependentes',
      url: '/dashboard/dependants',
      Icon: Baby,
    },
    {
      title: 'Minha Afiliação',
      url: '/dashboard/affiliation',
      Icon: CreditCard,
    },
    {
      title: 'Explorar Clubes',
      url: '/dashboard/clubs',
      Icon: School,
    },
    {
      title: 'Meu Clube',
      url: '/dashboard/my-club',
      Icon: Shield,
    },
    {
      title: 'Explorar Torneios',
      url: '/dashboard/tournaments',
      Icon: Trophy,
    },
    {
      title: 'Administração',
      url: '/admin/dashboard/',
      Icon: ShieldUser,
      requiredRoles: [UserRoles.ADMIN],
    },
  ],
  admin: [
    {
      title: 'Início',
      url: '/admin/dashboard',
      Icon: ShieldUser,
    },
    {
      title: 'Usuários',
      url: '/admin/dashboard/users',
      Icon: UserSearch,
    },
    {
      title: 'Dependentes',
      url: '/admin/dashboard/dependants',
      Icon: Baby,
    },
    {
      title: 'Clubes',
      url: '/admin/dashboard/clubs',
      Icon: School,
    },
    {
      title: 'Afiliações',
      url: '/admin/dashboard/affiliations',
      Icon: CreditCard,
    },
    {
      title: 'Treinamentos',
      url: '/admin/dashboard/trainings',
      Icon: PlayCircle,
    },
    {
      title: 'Área de Membro',
      url: '/dashboard',
      Icon: HomeIcon,
    },
  ],
  baseRoutes: ['/dashboard', '/admin/dashboard'],
};
