'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';
import { UserRoles } from '@/domain/enums/user.roles';

export async function getClubChartsAction(clubId: string) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const adminGateway = Inject.AdminGateway(session.accessToken);
  return adminGateway.getClubCharts(clubId);
}
