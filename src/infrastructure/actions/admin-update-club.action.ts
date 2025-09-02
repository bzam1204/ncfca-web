'use server';

import { auth } from "@/infrastructure/auth";
import { Inject } from "@/infrastructure/containers/container";
import { UpdateClubByAdminDto } from "@/contracts/api/admin.dto";

export async function adminUpdateClubAction(clubId: string, payload: UpdateClubByAdminDto) {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');
  const adminGateway = Inject.AdminGateway(session.accessToken);
  return adminGateway.updateClub(clubId, payload);
}