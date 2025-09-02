import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from '@/components/recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

import { EnrollmentRequest } from '@/domain/entities/enrollment-request.entity';
import { Club } from '@/domain/entities/entities';
import { AffiliationDto } from '@/contracts/api/affiliation.dto';

import { getAffiliationsAction } from '@/infrastructure/actions/admin/get-affiliations.action';
import { getEnrollmentsAction } from '@/infrastructure/actions/admin/get-enrollments.action';
import { getClubsAction } from '@/infrastructure/actions/admin/get-clubs.action';

export async function GrowthCharts() {
  const [affiliations, enrollments, clubs] = await Promise.all([getAffiliationsAction(), getEnrollmentsAction(), getClubsAction()]);

  const monthlyData = processMonthlyData(affiliations, clubs, enrollments);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vetores de Crescimento</CardTitle>
        <CardDescription>Novas afiliações, clubes e matrículas nos últimos 12 meses.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="w-full h-[350px]">
          <AreaChart accessibilityLayer data={monthlyData}>
            <defs>
              <linearGradient id="fillAfiliações" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-Afiliações)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-Afiliações)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillClubes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-Clubes)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-Clubes)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMatrículas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-Matrículas)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-Matrículas)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Area type="monotone" dataKey="Afiliações" stroke="var(--color-Afiliações)" fillOpacity={1} fill="url(#fillAfiliações)" />
            <Area type="monotone" dataKey="Clubes" stroke="var(--color-Clubes)" fillOpacity={1} fill="url(#fillClubes)" />
            <Area type="monotone" dataKey="Matrículas" stroke="var(--color-Matrículas)" fillOpacity={1} fill="url(#fillMatrículas)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const chartConfig = {
  Afiliações: { label: 'Afiliações', color: 'var(--chart-5)' },
  Clubes: { label: 'Clubes', color: 'magenta' },
  Matrículas: { label: 'Matrículas', color: '#00dfbe' },
} satisfies ChartConfig;

// A lógica de cálculo foi extraída para uma função pura no servidor.
const processMonthlyData = (affiliations: AffiliationDto[], clubs: Club[], enrollments: EnrollmentRequest[]) => {
  const data: { [key: string]: { Afiliações: number; Clubes: number; Matrículas: number } } = {};
  const now = new Date();

  // Inicializa os últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
    data[month] = { Afiliações: 0, Clubes: 0, Matrículas: 0 };
  }

  affiliations.forEach((f) => {
    if (f.affiliatedAt) {
      const month = new Date(f.affiliatedAt).toLocaleString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
      if (data[month]) data[month].Afiliações++;
    }
  });

  clubs.forEach((c) => {
    if ((c as any).createdAt) {
      const month = new Date((c as any).createdAt).toLocaleString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
      if (data[month]) data[month].Clubes++;
    }
  });

  enrollments.forEach((e) => {
    const month = new Date(e.requestedAt).toLocaleString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
    if (data[month]) data[month].Matrículas++;
  });

  return Object.keys(data).map((month) => ({ month, ...data[month] }));
};
