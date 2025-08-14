'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Interface para os dados que vêm do backend
interface BackendClubChartsData {
  memberCountByType: Array<{ type: string; count: number }>;
  enrollmentsOverTime: Array<{ month: string; count: number }>;
  memberCountBySex: Array<{ sex: string; count: number }>;
  totalActiveMembers: number;
  totalPendingEnrollments: number;
}

// Interface para os dados que o frontend espera
interface ClubChartsData {
  demographics: {
    gender: { name: string; value: number; fill: string }[];
    age: { name: string; value: number; fill: string }[];
  };
  trendData: { month: string; approved: number; rejected: number }[];
}

const transformBackendData = (backendData: BackendClubChartsData): ClubChartsData => {
  // Cores para os gráficos
  const genderColors = {
    'MALE': 'var(--chart-1)',
    'FEMALE': 'var(--chart-2)',
  };
  
  const typeColors = {
    'STUDENT': 'var(--chart-3)',
    'ADULT': 'var(--chart-4)',
    'SENIOR': 'var(--chart-5)',
  };

  // Transformar dados de gênero
  const gender = backendData.memberCountBySex.map(item => ({
    name: item.sex === 'MALE' ? 'Masculino' : 'Feminino',
    value: item.count,
    fill: genderColors[item.sex as keyof typeof genderColors] || 'hsl(var(--chart-1))'
  }));

  // Transformar dados de tipo/faixa etária
  const age = backendData.memberCountByType.map(item => ({
    name: item.type === 'STUDENT' ? 'Estudante' : item.type === 'ADULT' ? 'Adulto' : 'Senior',
    value: item.count,
    fill: typeColors[item.type as keyof typeof typeColors] || 'hsl(var(--chart-3))'
  }));

  // Transformar dados de tendência (por enquanto, assumir que todos são aprovados)
  const trendData = backendData.enrollmentsOverTime.map(item => {
    const date = new Date(item.month);
    const monthYear = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    
    return {
      month: monthYear,
      approved: item.count,
      rejected: 0 // Por enquanto, sem dados de rejeições
    };
  });

  return {
    demographics: { gender, age },
    trendData
  };
};

const getAdminClubCharts = async (clubId: string, accessToken: string): Promise<ClubChartsData> => {
  const res = await fetch(`${BACKEND_URL}/admin/clubs/${clubId}/charts`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Falha ao buscar dados dos gráficos do clube.');
  
  const backendData: BackendClubChartsData = await res.json();
  return transformBackendData(backendData);
};

export function useAdminClubCharts(clubId: string) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';

  return useQuery({
    queryKey: ['admin-club-charts', clubId],
    queryFn: () => getAdminClubCharts(clubId, accessToken),
    enabled: !!clubId && !!accessToken,
  });
}