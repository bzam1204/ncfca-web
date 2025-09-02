import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/infrastructure/auth';
import { UserRoles } from '@/domain/enums/user.roles';

import { BackButton } from '@/components/ui/back-button';
import {getClubAction} from "@/infrastructure/actions/get-club";
import {AdminClubManagementClient} from "@/app/(admin)/admin/dashboard/clubs/[clubId]/_components/admin-club-management-client";
import {ClubActionsBar} from "@/app/(admin)/admin/dashboard/clubs/[clubId]/_components/club-actions-bar";
import {Skeleton} from "@/components/ui/skeleton";



async function ClubDetailsLoader({ clubId }: { clubId: string }) {
  const club = await getClubAction(clubId);
  if (!club) {
    notFound();
  }
  return (
    <div className="space-y-6">
      <ClubActionsBar club={club} />
      <AdminClubManagementClient initialClub={club} />
    </div>
  );
}

interface AdminClubDetailsPageProps {
  params: Promise<{
    clubId: string;
  }>;
}

export default async function AdminClubDetailsPage({ params }: AdminClubDetailsPageProps) {
  const { clubId } = await params;
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  return (
      <div className="space-y-4">
        <BackButton>Voltar</BackButton>
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <ClubDetailsLoader clubId={clubId} />
        </Suspense>
      </div>
  );
}