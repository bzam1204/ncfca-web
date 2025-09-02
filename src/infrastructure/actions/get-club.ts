'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';
import { UserRoles } from '@/domain/enums/user.roles';

export async function getClubAction(clubId: string) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }
  const clubGateway = Inject.ClubGateway(session.accessToken);
  return clubGateway.getById(clubId);
}
