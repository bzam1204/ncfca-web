import {Baby, CreditCard, LayoutGrid, School, Shield, ShieldUser, UserSearch} from "lucide-react";

export const navigation = {
  user : [
    {
      title : "Início",
      url : "/dashboard",
      icon : LayoutGrid,
    },
    {
      title : "Dependentes",
      url : "/dashboard/dependants",
      icon : Baby,
    },
    {
      title : "Minha Afiliação",
      url : "/dashboard/affiliation",
      icon : CreditCard
    },
    {
      title : "Explorar Clubes",
      url : "/dashboard/clubs",
      icon : School,
    },
    {
      title : "Meu Clube",
      url : "/dashboard/club-management",
      icon : Shield,
    },
  ],
  admin : [
    {
      title : "Início",
      url : "/admin/dashboard",
      icon : ShieldUser,
    },
    {
      title : "Usuários",
      url : "/admin/dashboard/users",
      icon : UserSearch,
    },
    {
      title : "Dependentes",
      url : "/admin/dashboard/dependants",
      icon : Baby,
    },
    {
      title : "Clubes",
      url : "/admin/dashboard/clubs",
      icon : School
    },
    {
      title : "Afiliações",
      url : "/admin/dashboard/affiliations",
      icon : CreditCard,
    },
  ],
  baseRoutes : ['/dashboard', '/admin/dashboard'],
}