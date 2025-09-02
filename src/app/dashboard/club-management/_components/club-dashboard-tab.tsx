// src/app/dashboard/club-management/_components/club-dashboard-tab.tsx
'use client';

import { useState, useMemo } from 'react';
import { useClubMembersQuery } from '@/hooks/use-club-members';
import { useEnrollmentHistoryQuery } from '@/hooks/use-enrollment-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, BarChart2, Clock } from 'lucide-react';
import { DashboardCharts } from './dashboard-charts';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-nowrap">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const calculateAge = (birthdate: string | Date): number => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

interface ClubDashboardTabProps {
  clubId: string;
}

export function ClubDashboardTab({ clubId }: ClubDashboardTabProps) {
  const [period, setPeriod] = useState(12);

  const { data: members = [], isLoading: isLoadingMembers, error: errorMembers } = useClubMembersQuery(clubId);
  const { data: allRequests = [], isLoading: isLoadingHistory, error: errorHistory } = useEnrollmentHistoryQuery(clubId);

  const isLoading = isLoadingMembers || isLoadingHistory;

  const filteredRequests = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - period);
    return allRequests.filter((req) => new Date(req.requestedAt) >= cutoffDate);
  }, [allRequests, period]);

  const demographics = useMemo(() => {
    if (isLoading) return { gender: [], age: [] };

    const initialData = {
      gender: { MALE: 0, FEMALE: 0 },
      age: { '15-17': 0, '12-14': 0, '9-11': 0 },
    };

    const aggregated = members.reduce((acc, member) => {
      if (member.sex === 'MALE' || member.sex === 'FEMALE') {
        acc.gender[member.sex]++;
      }

      const memberAge = calculateAge(member.birthDate);
      if (memberAge >= 15 && memberAge <= 17) {
        acc.age['15-17']++;
      } else if (memberAge >= 12 && memberAge <= 14) {
        acc.age['12-14']++;
      } else if (memberAge >= 9 && memberAge <= 11) {
        acc.age['9-11']++;
      }
      return acc;
    }, initialData);

    return {
      gender: [
        { name: 'masculino', value: aggregated.gender.MALE, fill: 'var(--chart-3)' },
        { name: 'feminino', value: aggregated.gender.FEMALE, fill: 'red' },
      ],
      age: [
        { name: '15-17 anos', value: aggregated.age['15-17'], fill: 'var(--chart-1)' },
        { name: '12-14 anos', value: aggregated.age['12-14'], fill: 'var(--chart-2)' },
        { name: '9-11 anos', value: aggregated.age['9-11'], fill: 'var(--chart-3)' },
      ],
    };
  }, [members, isLoading]);

  const operational = useMemo(() => {
    if (isLoading) return { conversionRate: '0%', avgResponseTimeDays: '0 dias', trendData: [] };
    const approved = filteredRequests.filter((r) => r.status === 'APPROVED');
    const rejected = filteredRequests.filter((r) => r.status === 'REJECTED');
    const conversionRate =
      approved.length + rejected.length > 0 ? ((approved.length / (approved.length + rejected.length)) * 100).toFixed(1) + '%' : 'N/A';

    const resolvedRequests = filteredRequests.filter((r) => r.resolvedAt);
    const totalResponseTime = resolvedRequests.reduce(
      (acc, req) => acc + (new Date(req.resolvedAt!).getTime() - new Date(req.requestedAt).getTime()),
      0,
    );
    const avgResponseTimeMs = resolvedRequests.length > 0 ? totalResponseTime / resolvedRequests.length : 0;
    const avgResponseTimeDays = (avgResponseTimeMs / (1000 * 60 * 60 * 24)).toFixed(1) + ' dias';

    const trendData = Array.from({ length: period }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { month: d.toLocaleString('default', { month: 'short' }), approved: 0, rejected: 0 };
    }).reverse();

    filteredRequests.forEach((req) => {
      const month = new Date(req.requestedAt).toLocaleString('default', { month: 'short' });
      const monthData = trendData.find((d) => d.month === month);
      if (monthData) {
        if (req.status === 'APPROVED') monthData.approved++;
        if (req.status === 'REJECTED') monthData.rejected++;
      }
    });

    return { conversionRate, avgResponseTimeDays, trendData };
  }, [filteredRequests, isLoading, period]);

  if (errorMembers || errorHistory) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Dashboard</AlertTitle>
        <AlertDescription>{(errorMembers || errorHistory)?.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select onValueChange={(value) => setPeriod(Number(value))} defaultValue={String(period)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Taxa de Aprovação" value={isLoading ? '...' : operational.conversionRate} icon={BarChart2} />
        <StatCard title="Tempo Médio de Resposta" value={isLoading ? '...' : operational.avgResponseTimeDays} icon={Clock} />
      </div>

      {isLoading ? <Skeleton className="h-[400px] w-full" /> : <DashboardCharts demographics={demographics} trendData={operational.trendData} />}
    </div>
  );
}
