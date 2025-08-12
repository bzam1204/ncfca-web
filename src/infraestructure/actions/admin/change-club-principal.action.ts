'use server';

import { auth } from '@/infraestructure/auth';
import { Inject } from '@/infraestructure/containers/container';
import { revalidateTag } from 'next/cache';
import { NextKeys } from '@/infraestructure/cache/next-keys';
import { UserRoles } from '@/domain/enums/user.roles';

export async function changeClubPrincipalAction(clubId: string, newPrincipalId: string) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }
  
  const adminGateway = Inject.AdminGateway(session.accessToken);
  await adminGateway.changeClubPrincipal(clubId, { newPrincipalId });

  revalidateTag(NextKeys.admin.clubs);
  revalidateTag(NextKeys.clubs.details(clubId));
}