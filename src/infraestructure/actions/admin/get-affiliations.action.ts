'use server';

import {auth} from "@/infraestructure/auth";
import {Inject} from "@/infraestructure/containers/container";
import {UserRoles} from "@/domain/enums/user.roles";

export async function getAffiliationsAction() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const adminGateway = Inject.AdminGateway(session.accessToken);
  return adminGateway.getAffiliations();
}
