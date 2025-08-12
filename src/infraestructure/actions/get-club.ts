'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";
import { UserRoles } from "@/domain/enums/user.roles";

export async function getClubAction(clubId: string) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  // Corrigido para usar o gateway correto
  const gateway = Inject.ClubGateway(session.accessToken);
  return gateway.getById(clubId);
}
