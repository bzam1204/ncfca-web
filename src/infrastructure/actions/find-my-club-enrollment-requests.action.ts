'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';

export async function findMyClubEnrollmentRequestsAction() {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Acesso negado.');
  const clubGateway = Inject.ClubGateway(session.accessToken);
  return clubGateway.findMyClubEnrollmentRequests();
}

