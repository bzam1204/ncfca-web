'use server';

import { User } from '@/domain/entities/entities';
import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';
import { UserRoles } from '@/domain/enums/user.roles';

export async function getUserByIdAction(userId: string): Promise<User> {
  const session = await auth();

  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const adminGateway = Inject.AdminGateway(session.accessToken);
  return adminGateway.getUserById(userId);
}
