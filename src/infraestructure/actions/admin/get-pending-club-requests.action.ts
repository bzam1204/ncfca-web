'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";
import { UserRoles } from "@/domain/enums/user.roles";

export async function getPendingClubRequestsAction() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const gateway = Inject.ClubRequestGateway(session.accessToken);
  return gateway.getPending();
}
