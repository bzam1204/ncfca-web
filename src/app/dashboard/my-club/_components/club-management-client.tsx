'use client';

import { useState } from 'react';

import { Edit, Users, AlertTriangle } from 'lucide-react';

import { Club } from '@/domain/entities/entities';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { useMyClub } from '@/hooks/clubs/use-my-club';

import { PendingRequestsTable } from './pending-requests-table';
import { ClubDashboardTab } from './club-dashboard-tab';
import { EditClubForm } from './edit-club-form';
import { MembersTable } from './members-table';
import { TrainingsTab } from './trainings-tab';

export function ClubManagementClient({ initialClub }: { initialClub: Club | null }) {
  const { data: myClub, error, isFetching, refetch } = useMyClub(initialClub);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isFetching && !myClub) return <div>Carregando dados do clube...</div>;
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
  if (!myClub) return <div>Seu clube ainda não foi aprovado ou não foi encontrado.</div>;

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{myClub.name}</CardTitle>
                <CardDescription>
                  {myClub.address.city}, {myClub.address.state}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Button variant="outline" size="sm" className="pointer-events-none">
                  <Users className="mr-2 h-4 w-4" />
                  Membros: {myClub.corum}
                </Button>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Clube
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="flex w-full overflow-x-auto flex-nowrap gap-1 justify-start no-scrollbar">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="requests">Solicitações</TabsTrigger>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="trainings">Treinamentos</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <ClubDashboardTab />
          </TabsContent>
          <TabsContent value="requests" className="mt-6">
            <PendingRequestsTable clubId={myClub.id} />
          </TabsContent>
          <TabsContent value="members" className="mt-6">
            <MembersTable clubId={myClub.id} />
          </TabsContent>
          <TabsContent value="trainings" className="mt-6">
            <TrainingsTab />
          </TabsContent>
        </Tabs>
      </div>
      <EditClubForm club={myClub} onSuccess={() => setIsEditModalOpen(false)} />
    </Dialog>
  );
}
