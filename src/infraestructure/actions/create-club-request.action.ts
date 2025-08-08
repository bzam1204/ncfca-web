'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";
import { CreateClubRequestDto } from "@/contracts/api/club-management.dto";

export async function createClubRequestAction(dto: CreateClubRequestDto) {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');
  const gateway = Inject.ClubRequestGateway(session.accessToken);
  await gateway.create(dto);
}
