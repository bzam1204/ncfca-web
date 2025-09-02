// src/app/(admin)/admin/dashboard/clubs/[clubId]/_components/dashboard-charts.tsx
'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAdminClubCharts } from '@/hooks/use-admin-club-charts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// --- GRÁFICO DE DISTRIBUIÇÃO (PIZZA/DONUT) ---

interface DistributionChartProps {
  title: string;
  description: string;
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
  config: ChartConfig;
}

const DistributionChart = ({ title, description, data, config }: DistributionChartProps) => (
  <Card className="flex flex-col">
    <CardHeader className="items-center pb-0">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} />
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

// --- GRÁFICO DE TENDÊNCIA DE MATRÍCULAS (ÁREA) ---

interface TrendChartProps {
  data: {
    month: string;
    approved: number;
    rejected: number;
  }[];
}

const trendChartConfig = {
  approved: {
    label: 'Aprovadas',
    color: 'var(--chart-2)',
  },
  rejected: {
    label: 'Rejeitadas',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

const EnrollmentTrendChart = ({ data }: TrendChartProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Tendência de Matrículas</CardTitle>
      <CardDescription>Volume de solicitações de matrícula aprovadas e rejeitadas ao longo do tempo.</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={trendChartConfig}>
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Area dataKey="approved" type="natural" fill="var(--color-approved)" fillOpacity={0.4} stroke="var(--color-approved)" stackId="a" />
          <Area dataKey="rejected" type="natural" fill="var(--color-rejected)" fillOpacity={0.4} stroke="var(--color-rejected)" stackId="a" />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

// --- COMPONENTE EXPORTADO ---

interface DashboardChartsProps {
  clubId: string;
}

export function DashboardCharts({ clubId }: DashboardChartsProps) {
  const { data: chartsData, isLoading, error } = useAdminClubCharts(clubId);

  if (isLoading) return <Skeleton className="h-[600px] w-full" />;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  if (!chartsData) return null;

  const genderConfig = {
    members: { label: 'Membros' },
    ...Object.fromEntries(
      chartsData.demographics.gender.map((g) => [
        g.name,
        {
          label: g.name.charAt(0).toUpperCase() + g.name.slice(1),
          color: g.fill,
        },
      ]),
    ),
  } satisfies ChartConfig;

  const ageConfig = {
    members: { label: 'Membros' },
    ...Object.fromEntries(chartsData.demographics.age.map((g) => [g.name, { label: g.name, color: g.fill }])),
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <DistributionChart
          title="Distribuição por Gênero"
          description="Composição atual do clube"
          data={chartsData.demographics.gender}
          config={genderConfig}
        />
        <DistributionChart
          title="Distribuição por Faixa Etária"
          description="Composição etária do clube"
          data={chartsData.demographics.age}
          config={ageConfig}
        />
      </div>
      <div className="grid grid-cols-1">
        <EnrollmentTrendChart data={chartsData.trendData} />
      </div>
    </div>
  );
}
