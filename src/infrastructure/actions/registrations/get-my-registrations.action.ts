'use server';

import { SearchMyRegistrationsFilter, SearchMyRegistrationView } from '@/contracts/api/registration.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function getMyRegistrationsAction(filter?: SearchMyRegistrationsFilter): Promise<SearchMyRegistrationView> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.RegistrationsGateway(session.accessToken);
  const myRegistrations = await gateway.searchMyRegistrations(filter);
  return myRegistrations;
}
