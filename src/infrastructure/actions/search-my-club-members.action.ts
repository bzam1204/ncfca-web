'use server';

import { SearchMyClubMembersQuery } from '@/contracts/api/club-member.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function searchMyClubMembersAction(query?: SearchMyClubMembersQuery) {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Acesso negado.');
  const clubGateway = Inject.ClubGateway(session.accessToken);
  const members = await clubGateway.searchMyClubMembers(query);
  return members;
}
