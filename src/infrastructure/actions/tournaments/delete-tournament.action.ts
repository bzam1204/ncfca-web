'use server';

import { revalidateTag } from 'next/cache';

import { Inject } from '@/infrastructure/containers/container';
import { NextKeys } from '@/infrastructure/cache/next-keys';
import { auth } from '@/infrastructure/auth';

export async function deleteTournamentAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.TournamentsGateway(session.accessToken);
  await gateway.delete(id);
  revalidateTag(NextKeys.tournaments.all);
}
