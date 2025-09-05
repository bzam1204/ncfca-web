import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { auth } from '@/infrastructure/auth';

import { BackButton } from '@/components/ui/back-button';
import { Skeleton } from '@/components/ui/skeleton';
import { TournamentDetailsCard } from '@/app/dashboard/tournaments/[id]/_components/tournament-details-card';

interface TournamentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function TournamentDetailsLoader({ id }: { id: string }) {
  // Client data fetching happens inside the card via React Query.
  return <TournamentDetailsCard tournamentId={id} />;
}

export default async function TournamentDetailsPage({ params }: TournamentDetailsPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="space-y-4">
      <BackButton>Voltar</BackButton>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TournamentDetailsLoader id={id} />
      </Suspense>
    </div>
  );
}

