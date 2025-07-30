'use client';

import {Dispatch, SetStateAction, useState} from 'react';
import {AlertTriangle, Edit, RefreshCw, SearchX, Users} from 'lucide-react';
import {UpdateSession, useSession} from 'next-auth/react';

import {UserRoles} from "@/domain/enums/user.roles";

import {CreateClubResponseDto} from '@/contracts/api/club-management.dto';
import {useMyClubQuery} from '@/application/use-cases/use-club-management.use-case';

import {Card, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import {Dialog, DialogTrigger} from '@/components/ui/dialog';
import {Skeleton} from '@/components/ui/skeleton';
import {Button} from '@/components/ui/button';

import {PendingRequestsTable} from "./_components/pending-requests-table";
import {ClubDashboardTab} from './_components/club-dashboard-tab';
import {CreateClubForm} from './_components/create-club-form';
import {NonDirectorCTA} from './_components/non-director-cta';
import {MembersTable} from "./_components/members-table";
import {EditClubForm} from './_components/edit-club-form';

export default function ClubManagementPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [view, setView] = useState<'overview' | 'create-form'>('overview');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const session = useSession({required : true});
  const isClubDirector: boolean = session.data?.user?.roles?.includes(UserRoles.DONO_DE_CLUBE) || false;
  const accessToken = session.data?.accessToken ?? '';
  const query = useMyClubQuery(accessToken);
  const myClub = query.data ?? null;
  if (query.isLoading || query.isRefetching || !session.data) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }
  if (!isClubDirector) return <NonDirectorCTA onCreateClubClick={() => setView('create-form')} />;
  if (query.error) return ErrorAlert({message : query.error.message, retry : query.refetch, isRetrying : query.isRefetching});
  if (view === 'create-form') {
    return <CreateClubForm onSuccess={(response) => handleClubCreationSuccess(response, setView, session.update)} />;
  }
  if (!myClub) return NotFoundAlert({message : 'Clube não encontrado.', retry : query.refetch, isRetrying : query.isRefetching});
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
                    className="mr-2 h-4w-4/5 flex justify-start " />Total de Membros : {myClub.corum}
                </Button>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><Edit
                      className="mr-2 h-4  w-4/5" /> Editar Clube</Button>
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

async function handleClubCreationSuccess(
    response: CreateClubResponseDto,
    setView: Dispatch<SetStateAction<"overview" | "create-form">>,
    update: UpdateSession
) {
  await update({
    accessToken : response.accessToken,
    refreshToken : response.refreshToken,
  });
  setView('overview');
}

 function ErrorAlert(input: {message: string; retry: () => void, isRetrying: boolean}) {
  return <Alert variant="destructive" className='flex flex-col gap-6 justify-center items-center'>
    <div className='flex gap-2 items-center'>
      <AlertTriangle className="h-4 w-4" /> <AlertTitle>Algo Deu Errado</AlertTitle>
    </div>
    <AlertDescription>{input.message}</AlertDescription>
    <Button
        variant="destructive"
        onClick={() => input.retry()}
        disabled={input.isRetrying}
        className='cursor-pointer hover:bg-red-800 active:bg-red-500'>
      <RefreshCw className={input.isRetrying ? "animate-spin" : ''} /> Tentar Novamente
    </Button>
  </Alert>;
}

 function NotFoundAlert(input: {message: string, retry: () => void, isRetrying: boolean}) {
  return (<Alert variant="default" className='flex flex-col gap-6 justify-center items-center'>
    <div className='flex gap-2 items-center'>
      <SearchX className="h-4 w-4" /> <AlertTitle> Não Encontrado</AlertTitle>
    </div>
    <AlertDescription>{input.message}</AlertDescription>
    <Button
        onClick={() => input.retry()}
        disabled={input.isRetrying}
        className='cursor-pointer hover:bg-gray-600 active:bg-gray-400'>
      <RefreshCw className={input.isRetrying ? "animate-spin" : ''} /> Tentar Novamente
    </Button>
  </Alert>);
}
