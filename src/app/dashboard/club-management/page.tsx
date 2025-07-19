'use client';

import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useNotify} from '@/hooks/use-notify';
import {
  useMyClubQuery,
} from '@/hooks/use-cases/use-club-management.use-case';

import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import {AlertTriangle, Users, Edit} from 'lucide-react';
import {CreateClubForm} from './_components/create-club-form';
import {NonDirectorCTA} from './_components/non-director-cta';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card';
import {UserRoles} from "@/domain/enums/user.roles";
import {PendingRequestsTable} from '../../_components/pending-requests-table';
import {MembersTable} from './_components/members-table';
import {EditClubForm} from './_components/edit-club-form';
import {Button} from '@/components/ui/button';
import {Dialog, DialogTrigger} from '@/components/ui/dialog';
import {CreateClubResponseDto} from '@/contracts/api/club-management.dto';

export default function ClubManagementPage() {
  const [view, setView] = useState<'overview' | 'create-form'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {data : session, update : updateSession} = useSession({required : true});
  const queryClient = useQueryClient();
  const notify = useNotify();
  const router = useRouter();

  const accessToken = session?.accessToken ?? '';
  const isClubDirector = session?.user?.roles?.includes(UserRoles.DONO_DE_CLUBE);

  const {data : myClub, isLoading : isLoadingClub, error : errorClub} = useMyClubQuery(accessToken);

  const handleClubCreationSuccess = async (response: CreateClubResponseDto) => {
    notify.success("Clube criado com sucesso! Atualizando sua identidade...");

    await updateSession({
      accessToken : response.accessToken,
      refreshToken : response.refreshToken,
    });

    await queryClient.invalidateQueries({queryKey : ['my-club']});
    router.refresh();
    setView('overview');
  };

  if (isLoadingClub) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (isClubDirector) {
    if (errorClub) {
      return <Alert variant="destructive"><AlertTriangle
          className="h-4 w-4" /><AlertTitle>Erro Crítico</AlertTitle><AlertDescription>{errorClub.message}</AlertDescription></Alert>;
    }

    if (myClub) {
      return (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <div className="space-y-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex gap-2 flex-col">
                    <CardTitle className="flex items-center"> {myClub.name}</CardTitle>
                    <CardDescription>{myClub.city}, {myClub.state}</CardDescription>
                  </div>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Editar Clube</Button>
                  </DialogTrigger>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader><CardTitle>Solicitações Pendentes</CardTitle></CardHeader>
                <CardContent>
                  <PendingRequestsTable clubId={myClub.id} accessToken={accessToken} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center"><Users
                    className="mr-3 h-5 w-5" /> Membros Ativos</CardTitle></CardHeader>
                <CardContent>
                  <MembersTable clubId={myClub.id} />
                </CardContent>
              </Card>
            </div>
            <EditClubForm club={myClub} onSuccess={() => setIsEditModalOpen(false)} />
          </Dialog>
      );
    }
  }

  if (view === 'create-form') {
    return <CreateClubForm onSuccess={handleClubCreationSuccess} />;
  }

  return <NonDirectorCTA onCreateClubClick={() => setView('create-form')} />;
}
