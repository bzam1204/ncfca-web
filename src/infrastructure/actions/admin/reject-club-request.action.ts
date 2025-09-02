'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';
import { UserRoles } from '@/domain/enums/user.roles';
import { revalidateTag } from 'next/cache';
import { NextKeys } from '@/infrastructure/cache/next-keys';
import { RejectRequestDto } from '@/contracts/api/club-request.dto';

export async function rejectClubRequestAction(requestId: string, dto: RejectRequestDto) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const gateway = Inject.ClubRequestGateway(session.accessToken);
  await gateway.reject(requestId, dto);

  // Revalidação do cache: A lista de pendentes muda.
  revalidateTag(NextKeys.clubRequests.admin.pending);
}
