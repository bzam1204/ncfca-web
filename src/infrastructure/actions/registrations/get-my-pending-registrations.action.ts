'use server';

import { GetMyPendingRegistrationsListItemView } from '@/contracts/api/registration.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function getMyPendingRegistrationsAction(): Promise<GetMyPendingRegistrationsListItemView[]> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.RegistrationsGateway(session.accessToken);
  const registrations = await gateway.findMyPendingRegistrations();
  return registrations;
}
