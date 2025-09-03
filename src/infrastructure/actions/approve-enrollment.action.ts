'use server';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function approveEnrollmentAction(enrollmentId: string): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Acesso negado.');
  const clubGateway = Inject.ClubGateway(session.accessToken);
  return clubGateway.approveEnrollment(enrollmentId);
}
