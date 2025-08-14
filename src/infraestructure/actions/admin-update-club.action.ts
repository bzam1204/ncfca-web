'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";
import { UpdateClubByAdminDto } from "@/contracts/api/admin.dto";

export async function adminUpdateClubAction(clubId: string, payload: UpdateClubByAdminDto) {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');
  const adminGateway = Inject.AdminGateway(session.accessToken);
  return adminGateway.updateClub(clubId, payload);
}