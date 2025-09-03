'use server';

import { SearchMyClubMembersQueryDto } from '@/contracts/api/club-member.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function getClubMembersAction(query?: SearchMyClubMembersQueryDto) {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Acesso negado.');
  const clubGateway = Inject.ClubGateway(session.accessToken);
  return clubGateway.getMyClubMembers(query);
}
