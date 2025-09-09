import { Suspense } from 'react';
import { Trophy } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { CreateTournamentDialog } from '@/app/(admin)/admin/dashboard/tournaments/_components/create-tournament-dialog';
import { TournamentsList } from '@/app/(admin)/admin/dashboard/tournaments/_components/tournaments-list';

export default function AdminTournamentsPage() {
  return (
    <Suspense fallback={<Fallback />}> 
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Trophy className="mr-3 h-6 w-6" />
                Gerenciar Torneios
              </CardTitle>
              <CardDescription>Crie, edite e remova torneios do sistema.</CardDescription>
            </div>
            <CreateTournamentDialog />
          </CardHeader>
        </Card>
        <TournamentsList />
      </div>
    </Suspense>
  );
}

function Fallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}

