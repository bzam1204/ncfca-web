import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/infraestructure/auth';
import { UserRoles } from '@/domain/enums/user.roles';

import { BackButton } from '@/components/ui/back-button';
import {getClubAction} from "@/infraestructure/actions/get-club";
import {AdminClubManagementClient} from "@/app/(admin)/admin/dashboard/clubs/[clubId]/_components/admin-club-management-client";
import {Skeleton} from "@/components/ui/skeleton";

interface AdminClubDetailsPageProps {
  params: {
    clubId: string;
  };
}

async function ClubDetailsLoader({ clubId }: { clubId: string }) {
  const club = await getClubAction(clubId);
  if (!club) {
    notFound();
  }
  return <AdminClubManagementClient initialClub={club} />;
}

export default async function AdminClubDetailsPage({ params }: AdminClubDetailsPageProps) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  return (
      <div className="space-y-4">
        <BackButton>Voltar</BackButton>
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <ClubDetailsLoader clubId={params.clubId} />
        </Suspense>
      </div>
  );
}