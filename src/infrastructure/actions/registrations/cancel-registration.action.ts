'use server';

import { CancelRegistrationDto } from '@/contracts/api/registration.dto';
import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function cancelRegistrationAction(input: CancelRegistrationDto): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.RegistrationsGateway(session.accessToken);
  await gateway.cancelCompetitorRegistration(input);
}
