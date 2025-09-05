'use server';

import { RequestDuoRegistrationDto, RequestDuoRegistrationOutputDto } from '@/contracts/api/registration.dto';
import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function requestDuoRegistrationAction(
  input: RequestDuoRegistrationDto
): Promise<RequestDuoRegistrationOutputDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  
  const gateway = Inject.RegistrationsGateway(session.accessToken);
  const registration = await gateway.requestDuoCompetitorRegistration(input);
  return registration;
}