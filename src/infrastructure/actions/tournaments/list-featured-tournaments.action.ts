'use server';

import { FeaturedTournamentResponseDto } from '@/contracts/api/tournament.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function listFeaturedTournamentsAction(): Promise<FeaturedTournamentResponseDto[]> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.FeaturedTournamentsGateway(session.accessToken);
  const tournaments = await gateway.listFeatured();
  return tournaments;
}
