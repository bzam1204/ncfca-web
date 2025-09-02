'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';
import { UserRoles } from '@/domain/enums/user.roles';
import { ManageUserRoleDto } from '@/contracts/api/admin.dto';

export async function manageUserRoleAction(userId: string, data: ManageUserRoleDto): Promise<void> {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const adminGateway = Inject.AdminGateway(session.accessToken);
  return adminGateway.manageUserRole(userId, data);
}
