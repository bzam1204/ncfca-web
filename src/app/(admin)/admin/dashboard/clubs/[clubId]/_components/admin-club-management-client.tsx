'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, AlertTriangle } from 'lucide-react';
import { Club } from '@/domain/entities/entities';
import { useAdminClubById } from '@/hooks/clubs/use-admin-club-by-id';

import { DashboardCharts } from './dashboard-charts';
import { MembersTable } from './members-table';
import { PendingRequestsTable } from './pending-requests-table';

export function AdminClubManagementClient({ initialClub }: { initialClub: Club }) {
  const { data: club, error, isFetching, refetch } = useAdminClubById(initialClub.id, initialClub);

  if (isFetching && !club) return <div>Carregando dados do clube...</div>;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar os dados</AlertTitle>
        <AlertDescription>
          {error.message}
          <Button onClick={() => refetch()} variant="link">
            Tentar Novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  if (!club) return <div>Clube não encontrado.</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle>{club.name}</CardTitle>
            <CardDescription>
              {club.address.city}, {club.address.state}
            </CardDescription>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="pointer-events-none">
                <Users className="mr-2 h-4 w-4" />
                Membros: {club.corum}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="enrollments">Matrículas</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <DashboardCharts clubId={club.id} />
        </TabsContent>
        <TabsContent value="members" className="mt-6">
          <MembersTable clubId={club.id} />
        </TabsContent>
        <TabsContent value="enrollments" className="mt-6">
          <PendingRequestsTable clubId={club.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
