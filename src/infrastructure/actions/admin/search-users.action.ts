'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';
import { UserRoles } from '@/domain/enums/user.roles';
import { SearchUsersQuery } from '@/contracts/api/user.dto';

export async function searchUsersAction(query: SearchUsersQuery) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const adminGateway = Inject.AdminGateway(session.accessToken);
  return adminGateway.searchUsers(query);
}
