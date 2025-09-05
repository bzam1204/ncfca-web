'use server';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function acceptDuoRegistrationAction(registrationId: string): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.RegistrationsGateway(session.accessToken);
  await gateway.acceptDuoCompetitorRegistration(registrationId);
}