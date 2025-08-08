'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";

export async function getMyClubAction() {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');

  const gateway = Inject.ClubGateway(session.accessToken);
  return gateway.myClub();
}
