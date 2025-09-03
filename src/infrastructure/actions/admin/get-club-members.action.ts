'use server';

import {SearchClubMembersQueryDto} from '@/contracts/api/admin.dto';
import {UserRoles} from '@/domain/enums/user.roles';

import {auth} from '@/infrastructure/auth';
import {Inject} from '@/infrastructure/containers/container';

export async function getClubMembersAction(query: SearchClubMembersQueryDto) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }
  const adminGateway = Inject.AdminGateway(session.accessToken);
  const members = await adminGateway.searchClubMembersToAdmin(query);
  console.log('Membros do clube:', {members : JSON.stringify(members)});
  return members;
}
