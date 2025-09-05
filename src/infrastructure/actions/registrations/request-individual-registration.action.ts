'use server';

import { RequestIndividualRegistrationInputDto, RequestIndividualRegistrationOutputDto } from '@/contracts/api/registration.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function requestIndividualRegistrationAction(
  input: RequestIndividualRegistrationInputDto,
): Promise<RequestIndividualRegistrationOutputDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.RegistrationsGateway(session.accessToken);
  const registration = await gateway.registerIndividualCompetitor(input);
  return registration;
}
