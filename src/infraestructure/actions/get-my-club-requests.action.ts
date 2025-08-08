'use server';

import {auth} from "@/infraestructure/auth";
import {Inject} from "@/infraestructure/containers/container";

export async function getMyClubRequestsAction() {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');

  const gateway = Inject.ClubRequestGateway(session.accessToken);
  return gateway.getMyRequests();
}
