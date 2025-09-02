'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';

export async function getClubMembersAction(clubId: string) {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Acesso negado.');
  }

  const clubGateway = Inject.ClubGateway(session.accessToken);
  return clubGateway.getMembers(clubId);
}
