'use server';

import { UserRoles } from "@/domain/enums/user.roles";

import { auth } from "@/infrastructure/auth";
import { Inject } from "@/infrastructure/containers/container";

export async function getPendingClubRequestsAction() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }
  const gateway = Inject.ClubRequestGateway(session.accessToken);
  return gateway.getPending();
}
