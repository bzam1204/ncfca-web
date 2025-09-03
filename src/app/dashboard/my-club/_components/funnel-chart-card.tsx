// src/app/dashboard/club-management/_components/funnel-chart-card.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, X, Inbox } from 'lucide-react';

interface FunnelChartCardProps {
  total: number;
  approved: number;
  rejected: number;
  period: number;
}

const FunnelStage = ({
  icon: Icon,
  label,
  value,
  color,
  isEnd = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  isEnd?: boolean;
}) => (
  <div className={`relative flex items-center justify-between p-3 rounded-md ${color} text-white shadow`}>
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </div>
    <span className="text-xl font-bold">{value}</span>
    {!isEnd && (
      <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-current" />
    )}
  </div>
);

export function FunnelChartCard({ total, approved, rejected, period }: FunnelChartCardProps) {
  const processed = approved + rejected;

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Funil de Matrículas</CardTitle>
        <CardDescription>Fluxo de solicitações nos últimos {period} meses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FunnelStage icon={Inbox} label="Total de Solicitações Recebidas" value={total} color="bg-gray-500" />

        <div className="grid grid-cols-2 gap-4 pt-2">
          <FunnelStage icon={Check} label="Aprovadas" value={approved} color="bg-green-600" isEnd />
          <FunnelStage icon={X} label="Rejeitadas" value={rejected} color="bg-red-600" isEnd />
        </div>
        {total > 0 && (
          <div className="text-center text-sm text-muted-foreground pt-2">
            <p>
              <span className="font-bold">{processed}</span> de <span className="font-bold">{total}</span> solicitações foram processadas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
