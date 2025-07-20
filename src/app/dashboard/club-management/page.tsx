'use client';

import {Dispatch, SetStateAction, useState} from 'react';
import {UpdateSession, useSession} from 'next-auth/react';
import {useMyClubQuery} from '@/hooks/use-cases/use-club-management.use-case';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import {AlertTriangle, Edit, Users} from 'lucide-react';
import {CreateClubForm} from './_components/create-club-form';
import {NonDirectorCTA} from './_components/non-director-cta';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card';
import {UserRoles} from "@/domain/enums/user.roles";
import {PendingRequestsTable} from '../../_components/pending-requests-table';
import {EditClubForm} from './_components/edit-club-form';
import {Button} from '@/components/ui/button';
import {Dialog, DialogTrigger} from '@/components/ui/dialog';
import {CreateClubResponseDto} from '@/contracts/api/club-management.dto';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ClubDashboardTab} from './_components/club-dashboard-tab';
import {MembersTable} from "@/app/dashboard/club-management/_components/members-table";
import {Session} from "next-auth";

export default function ClubManagementPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [view, setView] = useState<'overview' | 'create-form'>('overview');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const session = useSession({required : true});
  const isClubDirector = session.data?.user?.roles?.includes(UserRoles.DONO_DE_CLUBE);
  const accessToken = session.data?.accessToken ?? '';
  const query = useMyClubQuery(accessToken);
  const myClub = query.data ?? null;

  if (query.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (isClubDirector) {
    if (query.error) {
      return <Alert variant="destructive"><AlertTriangle
          className="h-4 w-4" /><AlertTitle>Erro Crítico</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>;
    }

    if (myClub) {
      return (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <div className="space-y-8">
              <Card className="accent-amber-200">
                <CardHeader className="flex justify-between">
                  <div className="flex-3">
                    <CardTitle className="items-center text-2xl ">{myClub.name}</CardTitle>
                    <CardDescription>{myClub.city}, {myClub.state}</CardDescription>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('members')}><Users
                        className="mr-2 h-4 w-4 w-4/5 flex justify-start " />Total de Membros : {myClub.corum}</Button>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4 w-4/5" /> Editar Clube</Button>
                    </DialogTrigger>
                  </div>
                </CardHeader>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="dashboard">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="requests">Solicitações</TabsTrigger>
                  <TabsTrigger value="members">Membros</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="mt-6">
                  <ClubDashboardTab />
                </TabsContent>
                <TabsContent value="requests" className="mt-6">
                  <PendingRequestsTable clubId={myClub.id} accessToken={accessToken} />
                </TabsContent>
                <TabsContent value="members" className="mt-6">
                  <MembersTable />
                </TabsContent>
              </Tabs>

            </div>
            <EditClubForm club={myClub} onSuccess={() => setIsEditModalOpen(false)} />
          </Dialog>
      );
    }
  }

  if (view === 'create-form') {
    return <CreateClubForm onSuccess={(response) => handleClubCreationSuccess(response, setView, session.update)} />;
  }

  return <NonDirectorCTA onCreateClubClick={() => setView('create-form')} />;
}

async function handleClubCreationSuccess(
    response: CreateClubResponseDto,
    setView: Dispatch<SetStateAction<"overview" | "create-form">>,
    update: UpdateSession,
) {
  await update({accessToken : response.accessToken, refreshToken : response.refreshToken,});
  setView('overview');
};