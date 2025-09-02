import {Suspense} from 'react';

import {Skeleton} from '@/components/ui/skeleton';

import {ClubManagementClient} from './_components/club-management-client';
import {ClubRequestView} from './_components/club-request-view';

import {UserRoles} from "@/domain/enums/user.roles";

import {getMyClubRequestsAction} from '@/infrastructure/actions/get-my-club-requests.action';
import {getMyClubAction} from '@/infrastructure/actions/get-my-club.action';
import {auth} from '@/infrastructure/auth';

export default async function ClubManagementPage() {
  const session = await auth();
  return (
      <Suspense fallback={<PageSkeleton />}>
        {isPrincipal(session?.user.roles) ? <PrincipalDashboard /> : <UserRequestView />}
      </Suspense>
  );
}

async function PrincipalDashboard() {
  const club = await getMyClubAction();
  return <ClubManagementClient initialClub={club} />;
}

async function UserRequestView() {
  const requests = await getMyClubRequestsAction();
  return <ClubRequestView initialRequests={requests} />;
}

function PageSkeleton() {
  return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
}

function isPrincipal(userRoles?: UserRoles[]) {
  return userRoles?.includes(UserRoles.DONO_DE_CLUBE) ?? false;
}
