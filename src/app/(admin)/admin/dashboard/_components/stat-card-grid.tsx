'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, CreditCard, Clock, RefreshCw } from "lucide-react"; // Ícone adicionado

interface StatCardGridProps {
  kpis: {
    activeAffiliations: number;
    totalClubs: number;
    totalMembers: number;
    pendingEnrollments: number;
    pendingRenewals: number; // Novo KPI
  };
}

const StatCard = ({ title, value, icon: Icon }: { title: string, value: number, icon: React.ElementType }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString('pt-BR')}</div>
      </CardContent>
    </Card>
);

export function StatCardGrid({ kpis }: StatCardGridProps) {
  return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Famílias Ativas" value={kpis.activeAffiliations} icon={CreditCard} />
        <StatCard title="Clubes Ativos" value={kpis.totalClubs} icon={Shield} />
        <StatCard title="Membros Ativos" value={kpis.totalMembers} icon={Users} />
        <StatCard title="Matrículas Pendentes" value={kpis.pendingEnrollments} icon={Clock} />
        <StatCard title="Renovações Pendentes" value={kpis.pendingRenewals} icon={RefreshCw} />
      </div>
  );
}