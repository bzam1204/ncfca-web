'use server';

import {auth} from "@/infrastructure/auth";
import {Inject} from "@/infrastructure/containers/container";

export async function getMyClubRequestsAction() {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');

  const gateway = Inject.ClubRequestGateway(session.accessToken);
  return gateway.getMyRequests();
}
