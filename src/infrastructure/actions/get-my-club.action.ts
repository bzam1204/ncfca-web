'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';

export async function getMyClubAction() {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Não autorizado.');
  const gateway = Inject.ClubGateway(session.accessToken);
  const myClub = await gateway.myClub();
  return myClub;
}
