'use server';

import { auth } from "@/infrastructure/auth";
import { Inject } from "@/infrastructure/containers/container";
import { CreateClubRequestDto } from "@/contracts/api/club-management.dto";

export async function createClubRequestAction(dto: CreateClubRequestDto) {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');
  const gateway = Inject.ClubRequestGateway(session.accessToken);
  await gateway.create(dto);
}
