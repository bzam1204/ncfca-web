'use server';

import { PaginatedClubDto, SearchClubsQuery } from '@/contracts/api/club.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function searchClubsAction(query: SearchClubsQuery): Promise<PaginatedClubDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.ClubGateway(session.accessToken);
  const clubs = await gateway.search(query);
  return clubs;
}
