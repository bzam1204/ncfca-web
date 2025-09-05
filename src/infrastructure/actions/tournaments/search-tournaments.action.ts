'use server';

import { SearchTournamentsQuery, SearchTournamentsView } from '@/contracts/api/tournament.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function searchTournamentsAction(query: SearchTournamentsQuery): Promise<SearchTournamentsView> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.TournamentsGateway(session.accessToken);
  const tournaments = await gateway.searchTournaments(query);
  return tournaments;
}
