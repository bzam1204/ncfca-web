import { Suspense } from 'react';
import { auth } from '@/infraestructure/auth';
import { UserRoles } from "@/domain/enums/user.roles";
import { getMyClubAction } from '@/infraestructure/actions/get-my-club.action';
import { getMyClubRequestsAction } from '@/infraestructure/actions/get-my-club-requests.action';
import { ClubManagementClient } from './_components/club-management-client';
import { ClubRequestView } from './_components/club-request-view';
import { Skeleton } from '@/components/ui/skeleton';

// Componente Loader para o Dashboard do Diretor
async function DirectorDashboard() {
  const club = await getMyClubAction();
  return <ClubManagementClient initialClub={club} />;
}

// Componente Loader para a View de Solicitações do Não-Diretor
async function UserRequestView() {
  const requests = await getMyClubRequestsAction();
  return <ClubRequestView initialRequests={requests} />;
}

// Skeleton para o Suspense
function PageSkeleton() {
  return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
}

export default async function ClubManagementPage() {
  const session = await auth();
  const isClubDirector = session?.user?.roles?.includes(UserRoles.DONO_DE_CLUBE) || false;

  return (
      <Suspense fallback={<PageSkeleton />}>
        {isClubDirector ? <DirectorDashboard /> : <UserRequestView />}
      </Suspense>
  );
}