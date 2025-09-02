'use server';

import { auth } from "@/infrastructure/auth";
import { Inject } from "@/infrastructure/containers/container";
import { UserRoles } from "@/domain/enums/user.roles";
import { revalidateTag } from "next/cache";
import { NextKeys } from "@/infrastructure/cache/next-keys";

export async function approveClubRequestAction(requestId: string) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const gateway = Inject.ClubRequestGateway(session.accessToken);
  await gateway.approve(requestId);

  // Revalidação do cache: A lista de pendentes muda e a lista de clubes é atualizada.
  revalidateTag(NextKeys.clubRequests.admin.pending);
  revalidateTag(NextKeys.admin.clubs);
}
