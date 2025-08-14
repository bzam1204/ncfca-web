'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";
import { UpdateClubDto } from "@/contracts/api/club-management.dto";

export async function updateMyClubAction(payload: UpdateClubDto) {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');

  const gateway = Inject.ClubGateway(session.accessToken);
  return gateway.updateMyClub(payload);
}