'use server';

import { revalidateTag } from 'next/cache';

import { TournamentResponseDto, UpdateTournamentDto } from '@/contracts/api/tournament.dto';

import { NextKeys } from '@/infrastructure/cache/next-keys';
import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function updateTournamentAction(id: string, dto: UpdateTournamentDto): Promise<TournamentResponseDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.TournamentsGateway(session.accessToken);
  const updated = await gateway.update(id, dto);
  revalidateTag(NextKeys.tournaments.all);
  revalidateTag(NextKeys.tournaments.details(id));
  return updated;
}
