'use server';

import { revalidateTag } from 'next/cache';

import { CreateTournamentDto, TournamentResponseDto } from '@/contracts/api/tournament.dto';

import { NextKeys } from '@/infrastructure/cache/next-keys';
import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function createTournamentAction(dto: CreateTournamentDto): Promise<TournamentResponseDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.TournamentsGateway(session.accessToken);
  const created = await gateway.create(dto);
  revalidateTag(NextKeys.tournaments.all);
  return created;
}
