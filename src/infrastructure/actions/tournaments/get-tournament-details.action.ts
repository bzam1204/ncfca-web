'use server';

import { TournamentDetailsView } from '@/contracts/api/tournament.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function getTournamentDetailsAction(id: string): Promise<TournamentDetailsView> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.TournamentsGateway(session.accessToken);
  const tournament = await gateway.getById(id);
  return tournament;
}
